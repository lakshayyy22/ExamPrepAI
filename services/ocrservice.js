const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const pdf = require("pdf-parse");

async function extractTextPdf(filePath){
    const buffer = fdatasync.readFileSync(filePath);
    const data = await pdf(buffer);
    return data.text;
}

async function extractText(filePath){
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    formData.append("language","eng");
    formData.append("isOverlayRequired", "false");
    const response = await axios.post(
        "https://api.ocr.space/parse/image",
        formData,{
            headers:{
                apikey: process.env.OCR_API_KEY,
                ...formData.getHeaders()
            }
        }
    );
    const data = response.data;
    if(data.IsErroredOnProcessing){
        console.log("OCR Error: ", data.ErrorMessage);
        return "";
    }
    return data.ParsedResults?.[0]?.ParsedText||"";
}

module.exports = {
    extractText,
    extractTextPdf
}