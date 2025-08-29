import { askGroq } from "../utils/aiService.js";

export const aiChat = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ message: "Prompt is required" });

    const answer = await askGroq(prompt);
    res.json({ reply: answer });
  } catch (error) {
    next(error);
  }
};
