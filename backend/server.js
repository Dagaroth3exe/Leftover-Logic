require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { cleanIngredients, generateRecipes, MODELS } = require("./recipes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Cheap endpoint the frontend pings on page load to wake a sleeping
// free-tier instance before the user asks for recipes.
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/generate", async (req, res) => {
  const ingredients = cleanIngredients(req.body?.ingredients);
  if (ingredients.length === 0) {
    return res.status(400).json({ error: "No ingredients provided" });
  }

  const started = Date.now();
  try {
    const recipes = await generateRecipes(ingredients);
    console.log(`Generated recipes for [${ingredients.join(", ")}] in ${Date.now() - started}ms`);
    res.json({ recipes });
  } catch (error) {
    const reason = error.status ? `HTTP ${error.status}` : error.message;
    console.error(`Generation failed after ${Date.now() - started}ms: ${reason}`);
    if (error.status === 429) {
      console.error("  Gemini quota hit. Free tier limits: https://aistudio.google.com/docs/rate-limits");
    }
    if (error.code === "NO_API_KEY") {
      return res.status(500).json({ error: "The server has no Gemini API key configured yet." });
    }
    if (error.status === 401 || error.status === 403) {
      return res.status(500).json({ error: "The server's Gemini API key was rejected." });
    }
    // Quota (429) and overload (503) get distinct codes so the UI can say the right thing.
    if (error.status === 429) {
      return res.status(429).json({
        code: "quota",
        error: "Gemini has hit its limit for now. Try again in a bit and it might just work :)",
      });
    }
    if (error.status === 503) {
      return res
        .status(503)
        .json({ code: "busy", error: "The kitchen is busy right now. Give it a minute and try again." });
    }
    res.status(502).json({ error: "Failed to generate recipes" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT} (models: ${MODELS.join(" → ")})`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️  GEMINI_API_KEY is not set: /api/generate will fail. Add it to backend/.env");
  }
});

// Vercel imports the app instead of running listen().
module.exports = app;
