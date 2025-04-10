const axios = require("axios");
const MISTRAL_API_KEY = "7aLCI45IxcwnQUx47C3URVhVjNMz4MZ2";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

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
    - Include 1 learning outcomes as bullet points
    - Include 1 key terms with their definitions
    - Provide 1 practical examples if applicable, if not give 2-3 facts about the topic.
    - Include Necessary subtopics (1) with their content (150-300 words) to teach all the learning objectives.
    
    Return ONLY the JSON object, without any markdown formatting or additional text.`;

    // const response = await axios.post(
    //   MISTRAL_API_URL,
    //   {
    //     model: "mistral-small-latest",
    //     messages: [
    //       {
    //         role: "user",
    //         content: prompt,
    //       },
    //     ],
    //     temperature: 0.7,
    //     max_tokens: 2000,
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${MISTRAL_API_KEY}`,
    //       "Content-Type": "application/json",
    //     },
    //     timeout: 20000,
    //   }
    // );

    // let content = response.data.choices[0].message.content;
    // content = content.replace(/```json\n?|\n?```/g, "");
    // content = content.trim();
    content = {
      title: "string",
      description: "string",
      learningOutcomes: ["string", "string", "string"],
      keyTerms: [
        {
          term: "string",
          definition: "string",
        },
      ],
      examples: ["string", "string"],
      content: [{ subTopic: "string", content: "string" }],
    };

    try {
      const lessonContent = content;
      // const lessonContent = JSON.parse(content);

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

      res.json(lessonContent);
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      res.status(500).json({
        error: "Failed to parse lesson content",
        details: parseError.message,
      });
    }
  } catch (error) {
    console.error("Error generating lesson:", error.message);
    if (error.code === "ECONNABORTED") {
      res.status(504).json({
        error: "Request timeout",
        details: "The request took too long to complete",
      });
    } else {
      res.status(500).json({
        error: "Failed to generate lesson content",
        details: error.message,
      });
    }
  }
}

module.exports = {
  generateLesson,
};
