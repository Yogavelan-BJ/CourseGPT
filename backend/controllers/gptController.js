const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
  },
});

async function generateLesson(req, res) {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

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
    - Description should be 1 sentences
    - Include 2 learning outcomes as bullet points
    - Include 2 key terms with their definitions
    - Provide 2 practical examples if applicable, if not give 2 facts about the topic.
    - Include Necessary subtopics (2) with their content (100 words) to teach all the learning objectives.
    
    Return ONLY the JSON object, without any markdown formatting or additional text.`;

    console.log("Making request to Mistral API...");
    const response = await api.post(MISTRAL_API_URL, {
      model: "mistral-small-latest",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    console.log("Mistral API response received:", response.status);
    let content = response.data.choices[0].message.content;
    content = content.replace(/```json\n?|\n?```/g, "");
    content = content.trim();

    try {
      const lessonContent = JSON.parse(content);

      if (!Array.isArray(lessonContent.keyTerms)) {
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

      return res.json(lessonContent);
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      return res.status(500).json({
        error: "Failed to parse lesson content",
        details: parseError.message,
      });
    }
  } catch (error) {
    console.error("Error generating lesson:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      return res.status(401).json({
        error: "Authentication failed",
        details: "Invalid API key or unauthorized access",
      });
    } else if (error.response?.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        details: "Too many requests to Mistral API",
      });
    } else {
      return res.status(500).json({
        error: "Failed to generate lesson content",
        details: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });
    }
  }
}

module.exports = {
  generateLesson,
};
