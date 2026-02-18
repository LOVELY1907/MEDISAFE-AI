const axios = require("axios");

async function generateText(prompt) {
  try {
    const response = await axios.post(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  }
);

    return response.data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("GEMINI ERROR:", error.response?.data || error.message);
    throw new Error("Gemini failed");
  }
}

module.exports = { generateText };