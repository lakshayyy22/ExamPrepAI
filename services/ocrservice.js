const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

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
    return response.data.ParsedResults[0].ParsedText;
}

module.exports = extractText;