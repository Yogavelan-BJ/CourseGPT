const mongoose = require("mongoose");

const KeyTermSchema = new mongoose.Schema(
  {
    term: { type: String, required: true },
    definition: { type: String, required: true },
  },
  { _id: false }
);

const ContentSectionSchema = new mongoose.Schema(
  {
    subTopic: { type: String, required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const LessonSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    learningOutcomes: { type: [String] },
    keyTerms: { type: [KeyTermSchema] },
    examples: { type: [String] },
    content: { type: [ContentSectionSchema] },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", LessonSchema);

module.exports = Lesson;
