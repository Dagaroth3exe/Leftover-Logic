require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// 👇 THE NEW ENDPOINT
app.post("/api/generate", async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients || ingredients.length === 0) {
    return res.status(400).json({ error: "No ingredients provided" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      I have these leftovers: ${ingredients.join(", ")}.
      Create 3 creative recipes using these ingredients. 
      You can assume I have basic pantry staples (oil, salt, pepper, water).
      
      IMPORTANT: Return the response ONLY as a valid JSON array of objects. 
      Do not add markdown formatting like \`\`\`json.
      
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

    // Cleanup formatting if Gemini adds markdown blocks
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const recipes = JSON.parse(text);
    res.json({ recipes });

  } catch (error) {
    console.error("Error generating recipes:", error);
    res.status(500).json({ error: "Failed to generate recipes" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});