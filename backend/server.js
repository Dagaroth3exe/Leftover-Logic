const express = require("express");
const cors = require("cors");

console.log("🟡 Server file loaded");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});

// 👇 this line ensures Node doesn't silently exit
process.on("exit", (code) => {
  console.log("❌ Process exiting with code:", code);
});
