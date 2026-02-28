const PDFDocument = require("pdfkit");

function streamPDF(res, subject, content) {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=${subject}-paper.pdf`
  );

  doc.pipe(res);

  doc.fontSize(18).text(`${subject} Question Paper`, {
    align: "center",
  });

  doc.moveDown();
  doc.fontSize(12).text(content);

  doc.end();
}

module.exports = { streamPDF };