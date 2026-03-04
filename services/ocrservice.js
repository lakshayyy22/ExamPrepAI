const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const pdf = require("pdf-parse");

async function extractTextPdf(filePath){
    const buffer = fs.readFileSync(filePath);
    const data = await pdf(buffer);
    return data.text;
}

async function extractText(fileUrl){
    const response = await axios.post(
        "https://api.ocr.space/parse/image",
        {
            url: fileUrl,
            language: "eng"
        },{
            headers:{
                apikey: process.env.OCR_API_KEY,
            }
        }
    );
    return response.data.ParsedResults?.[0]?.ParsedText||"";
}

module.exports = {
    extractText,
    extractTextPdf
}