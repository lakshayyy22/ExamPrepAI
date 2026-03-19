const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generatePaper(subject, context, type) {
let marks;

if (type === "Mid Sem 1" || type === "Mid Sem 2") {
  marks = 15;
} else if (type === "End Sem") {
  marks = 50;
}

const prompt = `
Generate ONLY ONE university question paper.

Subject: ${subject}
Exam Type: ${type}
Total Marks: ${marks}

STRICT RULES:
- Generate ONLY ${type} paper
- DO NOT generate any other exam type
- DO NOT mention other exam types
- Output MUST contain exactly ONE paper

STRUCTURE:
- Follow same structure as past papers
- Maintain similar difficulty
- DO NOT copy questions

Past Papers:
${context}
`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

module.exports = { generatePaper };