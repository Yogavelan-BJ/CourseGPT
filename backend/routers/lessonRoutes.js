const express = require("express");
const router = express.Router();
const {
  createLesson,
  updateLesson,
} = require("../controllers/lessonController");

// Create a new lesson
router.post("/", createLesson);

// Update an existing lesson
router.put("/:lessonId", updateLesson);

module.exports = router;
