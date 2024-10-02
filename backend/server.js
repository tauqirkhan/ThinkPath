const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

// dotenv.config({ path: "../.env" }); //Use export LLM_API_KEY=YOUR_API_KEY

const app = express();
const port = process.env.PORT || 5000;
const apiKey = process.env.LLM_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

app.use(cors());
app.use(express.json()); // Parse JSON bodies

app.get("/", (req, res) => {
  res.send("API is running");
});

app.post("/api/generate", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: "hi" }],
        },
      ],
    });

    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error("No response from AI model");
    }

    console.log(responseText);
    res.json({ response: responseText });
    // console.log(result.response.text());
    // res.json({ response: result.response.text() }); // Send the AI response back
  } catch (error) {
    res.status(500).json({ error: error.message }); // Handle errors
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
