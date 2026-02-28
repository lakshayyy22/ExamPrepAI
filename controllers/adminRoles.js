const pool = require("../config/db");
const supabase = require("../config/supabase");

async function getPendingPapers(req, res){
    const status = 'pending';
    const papers = await pool.query(        
        "SELECT * FROM exams WHERE status = $1", [status]
    );
    return res.render("pending_papers",{
        papers: papers.rows || [],
        msg: req.query.msg
    });
}

async function approvePaper(req, res){
    const id = req.params.id;
    const entry1 = await pool.query(
        "SELECT * FROM exams WHERE id = $1 AND status = 'pending'", [id]
    );
    const entry2 = await pool.query(
        "SELECT * FROM exams WHERE subject = $1 AND exam_type = $2 AND year = $3 AND id <> $4", [entry1.rows[0].subject, entry1.rows[0].exam_type, entry1.rows[0].year, id]
    );    
    await pool.query(
        "UPDATE exams SET status = 'approved' WHERE id = $1", [id]
    );
    if(entry2.rows.length > 0){
        await pool.query(
            "DELETE FROM exams WHERE id = $1", [entry2.rows[0].id]
        );
    }
    res.json({success: true});
}

async function rejectPaper(req, res){
    const id = req.params.id;
    const result = await pool.query(
        "SELECT pdf_url FROM exams WHERE id = $1 AND status = 'pending'", [id]
    );
    if(result.rows.length > 0){
        const path = decodeURIComponent(result.rows[0].pdf_url.split("/question-pdfs/")[1]);
        console.log("Deleteing file: ", path);
        await supabase.storage.from("question-pdfs").remove([path]);
    }
    await pool.query(
        "DELETE FROM exams WHERE id = $1", [req.params.id]
    );
    res.json({success: true});
}

async function getApproved(req, res){
    const result = await pool.query(
        "SELECT * FROM exams WHERE status = 'approved'"
    );
    const papers = result.rows;
    res.render("approved", {
        papers: papers||[]
    })
}

module.exports = {
    getApproved,
    getPendingPapers,
    rejectPaper,
    approvePaper
}