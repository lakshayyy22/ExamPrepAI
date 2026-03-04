import pytesseract
from pdf2image import convert_from_path
import sys
import json 

pdf_path = sys.argv[1]

pages = convert_from_path(pdf_path, dpi=300)

full_text = ""

for page in pages:
    text = pytesseract.image_to_string(page)
    full_text += text + "\n"

full_text = " ".join(full_text.split())
print(json.dumps({"text": full_text}))