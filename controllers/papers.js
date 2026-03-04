const pool = require("../config/db");
const {generatePaper} = require("../services/groqService");
const {streamPDF} = require("../services/pdfService");
const supabase = require("../config/supabase");
const{uploadPDF} = require("../services/pdfStorageService");
const {extractText, extractTextPdf} = require("../services/ocrservice");
const fs = require("fs");
const axios = require("axios");

async function getPapers(req , res){
    const {subject, exam_type} = req.query;
    const result = await pool.query(
        "SELECT * FROM exams WHERE subject=$1 AND exam_type=$2 AND status = 'approved'" , [subject, exam_type]
    );
    const papers = result.rows;
    return res.render("papers",{
        papers: papers || [],
        msg : req.query.msg
    });
}

async function sendPaper(req, res){
    const result = await pool.query(
        "SELECT * FROM exams WHERE subject = $1 AND  exam_type = $2 AND status = 'approved'", [req.body.subject , req.body.exam_type]
    )
    const papers = result.rows;
    const content = await generatePaper(req.body.subject , papers);
    streamPDF(res, req.body.subject, content);
}

async function uploadPaper(req, res){
    try{
        
        const { subject, exam_type, year } = req.body;
        if(!req.file){
            return res.status(400).send("No file uploaded");
        }
        const pdfUrl = await uploadPDF(req.file);

        const userId = req.user.id;

        let text = await extractTextPdf(req.file.path);
        console.log("File: ", req.file.path);
        if(!text|| text.trim() === ""){
            text = await extractText(pdfUrl);
        } 

        await pool.query(
            `
            INSERT INTO exams 
            (subject, year, exam_type, paper_txt, pdf_url, uploaded_by, status)
            VALUES ($1,$2,$3,$4,$5,$6,'pending')
            `,
            [subject, year, exam_type, text, pdfUrl, userId]
        );
        try{
            if(req.file && req.file.path){
                 await fs.promises.unlink(req.file.path);
            }
           
        }
        catch(err){
            console.log(err.message)
        }
        res.redirect("/dashboard?msg=uploaded");
    }catch(err){
        console.log(err);
        res.status(500).send("Upload failed");
    }
    
}

async function getPaperStream(req, res){
    const id = req.params.id;
    const result = await pool.query(
        "SELECT pdf_url FROM exams WHERE id = $1", [id]
    );
    if(result.rows.length === 0){
        return res.redirect("/papers?msg=failed");
    }
    const file = await axios.get(
        result.rows[0].pdf_url, {
        responseType:"stream"
        }
    );
    res.setHeader("Content-Type", "application/pdf");
    file.data.pipe(res);
}

module.exports = {
    getPapers,
    sendPaper,
    uploadPaper,
    getPaperStream
}