const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generatePaper(subject, context) {
  const prompt = `
Generate a NEW university question paper for ${subject}.

Rules:
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