ExamPrep AI 📚🤖

An AI-powered full-stack web application for uploading, reviewing, and browsing previous year exam papers.

---

🚀 Features

- Google OAuth Login and SignUp
- JWT Authentication
- Upload PDF question papers
- OCR text extraction
- Admin approval system
- Live approve/reject
- Secure file storage
- Clean UI dashboard

---

🛠 Tech Stack

Backend
- Node.js
- Express.js

Database & Storage
- PostgreSQL (Supabase)
- Supabase Storage

Authentication
- Passport.js (Google OAuth)
- JWT

AI & Processing
- Groq AI API
- OCR.space API

Frontend
- EJS

---

⚙️ Setup Instructions

1️⃣ Clone repository

git clone https://github.com/lakshayyy22/ExamPrepAI.git
cd ExamPrepAI

2️⃣ Install dependencies

npm install

3️⃣ Create ".env" file

Add:

DATABASE_URL=
SUPABASE_URL=
SUPABASE_KEY=
GROQ_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
JWT_KEY=
PORT=
OCR_API_KEY=

4️⃣ Running the Project

npm start

Server runs on:

Local development : http://localhost:3000

Live version : https://examprepai-9ijx.onrender.com

---

👨‍💻 Author

Lakshay
B.Tech IT — NIT Kurukshetra