import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("Fetching models from:", url);

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    if (data.models) {
      console.log("Available Models:");
      data.models.forEach((m) => {
        if (
          m.supportedGenerationMethods &&
          m.supportedGenerationMethods.includes("generateContent")
        ) {
          console.log(`- ${m.name}`);
        }
      });
    } else {
      console.log("Error or no models found:", data);
    }
  })
  .catch((err) => console.error("Fetch error:", err));
