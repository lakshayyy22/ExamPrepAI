const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generatePaper(subject, context, type) {
  const prompt = `
Generate a NEW university question paper for ${subject}.
It should be ${type}
If type is Mid Sem 1 or Mid Sem 2 then total paper is of 15 marks
If type is End Sem then total paper is of 50 marks
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