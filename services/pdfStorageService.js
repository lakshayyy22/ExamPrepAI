const supabase = require("../config/supabase")
const fs = require("fs");
async function uploadPDF(file){
    const fileName = Date.now() + "-" + file.originalname;
    const {data, error} = await supabase.storage
                                .from("question-pdfs")
                                .upload(fileName, fs.createReadStream(file.path) , {
                                    contentType: "application/pdf"
                                });
    if(error) throw error;
    const {data: urlData} = supabase.storage
                                .from("question-pdfs")
                                .getPublicUrl(fileName);    
    return urlData.publicUrl;
}

module.exports = {uploadPDF};