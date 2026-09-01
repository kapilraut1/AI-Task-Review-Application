require("dotenv").config();

const createApp = require("./app");

const PORT = process.env.PORT || 3000;

const app = createApp();

const aiMode = process.env.AI_API_KEY
  ? "AI analysis: using real OpenAI API"
  : "AI analysis: using mock AI service";

app.listen(PORT, () => {
  console.log(`Task Review API running at http://localhost:${PORT}`);
  console.log(aiMode);
});
