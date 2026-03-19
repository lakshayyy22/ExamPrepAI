const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generatePaper(subject, context, type) {
const prompt = `
Generate ONLY ONE university question paper.

Subject: ${subject}
Exam Type: ${type}

STRICT RULES:
- Generate ONLY ${type} paper
- DO NOT generate any other type (no Mid Sem 1, Mid Sem 2, End Sem mix)
- DO NOT mention other exam types
- DO NOT generate multiple papers

MARKS:
- If ${type} is Mid Sem 1 OR Mid Sem 2 → total = 15 marks
- If ${type} is End Sem → total = 50 marks

RULES:
- Same difficulty as past papers
- Same structure
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