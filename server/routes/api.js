import express from "express";
import Summary from "../models/Summary.js";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const router = express.Router();
router.post("/groq/summarize", async (req, res) => {
  try {
    const { text, options } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Server configuration error: Missing API Key" });
    }

    const prompt = `
        You are an expert summarizer. Please summarize the following text.
        
        Constraints:
        - Length: ${options.length}
        - Format: ${options.format} points or style
        - Tone: ${options.tone}
        
        Text to summarize:
        ${text}.
        Dont add your text to it, don't explain, only give direct summary of the input text. for example, don't say "Here is the summary of the text" or "Summary of the text is" or "The provided text comprehensively explain or offers...". 
      `;

    const chatcom = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_completion_tokens: 1024,
      stream: false,
    });

    const generatedText = chatcom.choices[0]?.message?.content || "";

    if (!generatedText) {
      throw new Error("Failed to generate summary from Groq.");
    }

    const newSummary = new Summary({
      originalText: text,
      summary: generatedText,
      options: options,
    });

    const savedSummary = await newSummary.save();

    res.json(savedSummary);
  } catch (error) {
    console.error("Backend Summarization Error:", error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/gemini/summarize", async (req, res) => {
  console.log("hii now");
  try {
    const { text, options } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Server configuration error: Missing API Key" });
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const prompt = `
        You are an expert summarizer. Please summarize the following text.
        
        Constraints:
        - Length: ${options.length}
        - Format: ${options.format} points or style
        - Tone: ${options.tone}
        
        Text to summarize:
        ${text}.
        Dont add your text to it, don't explain, only give direct summary of the input text. for example, don't say "Here is the summary of the text" or "Summary of the text is" or "The provided text comprehensively explain or offers...". 
      `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const generatedText = response.text;

    if (!generatedText) {
      throw new Error("Failed to generate summary from Gemini.");
    }

    const newSummary = new Summary({
      originalText: text,
      summary: generatedText,
      options: options,
    });

    const savedSummary = await newSummary.save();

    res.json(savedSummary);
  } catch (error) {
    console.error("Backend Summarization Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/history", async (req, res) => {
  try {
    const history = await Summary.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/history/:id", async (req, res) => {
  try {
    await Summary.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
