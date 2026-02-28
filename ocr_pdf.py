import pytesseract
from pdf2image import convert_from_path
import sys
import json 
# Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# POPPLER PATH (THIS FIXES YOUR ERROR)
#poppler_path = r"C:\poppler\poppler-25.12.0\Library\bin"

pdf_path = sys.argv[1]

pages = convert_from_path(pdf_path)

full_text = ""

for page in pages:
    text = pytesseract.image_to_string(page)
    full_text += text + "\n"

full_text = " ".join(full_text.split())
print(json.dumps({"text": full_text}))