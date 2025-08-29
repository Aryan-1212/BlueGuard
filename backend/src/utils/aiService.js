import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });
const groq = new Groq({ apiKey: process.env.AI_API_KEY });

export const askGroq = async (prompt) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error("Failed to fetch AI response");
  }
};
