const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mistral API configuration
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

// Generate lesson content
app.post("/api/generate-lesson", async (req, res) => {
  try {
    const { topic } = req.body;

    const prompt = `Generate a structured lesson about ${topic}. Return a JSON object with the following structure:
    {
      "title": "string",
      "description": "string",
      "learningOutcomes": ["string", "string", "string"],
      "keyTerms": [
        {
          "term": "string",
          "definition": "string"
        }
      ],
      "examples": ["string", "string"],
      "content":[{"subTopic":"string","content":"string"}]
    }

    Requirements:
    - Title should be concise and descriptive
    - Description should be 2-3 sentences
    - Include 3-4 learning outcomes as bullet points
    - Include 3-5 key terms with their definitions
    - Provide 2-3 practical examples if applicable, if not give 2-3 facts about the topic.
    - Include Necessary subtopics (5-6) with their content (150-300 words) to teach all the learning objectives.
    
    Return ONLY the JSON object, without any markdown formatting or additional text.`;

    const response = await axios.post(
      MISTRAL_API_URL,
      {
        model: "mistral-small-latest",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 10000,
      },
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Clean up the response content
    let content = response.data.choices[0].message.content;

    // Remove any markdown code block formatting
    content = content.replace(/```json\n?|\n?```/g, "");

    // Remove any leading/trailing whitespace
    content = content.trim();
    console.log(content);
    try {
      // Parse the cleaned JSON
      const lessonContent = JSON.parse(content);

      // Validate the response structure
      if (!Array.isArray(lessonContent.keyTerms)) {
        // Convert object format to array format if needed
        if (typeof lessonContent.keyTerms === "object") {
          lessonContent.keyTerms = Object.entries(lessonContent.keyTerms).map(
            ([term, definition]) => ({
              term,
              definition,
            })
          );
        } else {
          throw new Error("Invalid keyTerms format");
        }
      }

      res.json(lessonContent);
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      res.status(500).json({
        error: "Failed to parse lesson content",
        details: parseError.message,
      });
    }
  } catch (error) {
    console.error("Error generating lesson:", error);
    res.status(500).json({
      error: "Failed to generate lesson content",
      details: error.message,
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
