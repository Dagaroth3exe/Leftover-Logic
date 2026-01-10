require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Gemini
// Ensure your .env file has GEMINI_API_KEY=...
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// 👇 THE FIXED ENDPOINT (Handles Gemini's response safely)
app.post("/api/generate", async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ error: "No ingredients provided" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      I have these leftovers: ${ingredients.join(", ")}.
      Create 3 creative recipes using these ingredients. 
      You can assume I have basic pantry staples (oil, salt, pepper, water).
      
      IMPORTANT: Return the response ONLY as a valid JSON array of objects. 
      The structure must be:
      [
        {
          "title": "Recipe Name",
          "description": "Short description",
          "instructions": "Brief instructions"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("Gemini Raw Output:", text); // Debug log to see what Gemini actually sent

    // ROBUST CLEANUP: Find the JSON array inside the text
    const firstBracket = text.indexOf("[");
    const lastBracket = text.lastIndexOf("]");
    
    if (firstBracket !== -1 && lastBracket !== -1) {
      text = text.substring(firstBracket, lastBracket + 1);
    } else {
      throw new Error("No JSON array found in Gemini response");
    }

    const recipes = JSON.parse(text);
    res.json({ recipes });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to generate recipes", details: error.message });
  }
});

// 👇 THIS WAS LIKELY MISSING
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});

// ⭐️ CRITICAL FOR VERCEL: Export the app
module.exports = app;