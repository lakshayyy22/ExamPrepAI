const { exec } = require("child_process");
const pool = require("../config/db");
const util = require("util");

const execPromise = util.promisify(exec);

async function processOCR(filePath, subject, year, examType, pdfUrl, userId) {
  const { stdout } = await execPromise(`python ocr_pdf.py "${filePath}"`);

  const result = JSON.parse(stdout);
  const text = result.text;
  return text;
}

module.exports = {processOCR};