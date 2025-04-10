const express = require("express");
const router = express.Router();
const {
  createLesson,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");

// Create a new lesson
router.post("/", createLesson);

// Update an existing lesson
router.put("/:lessonId", updateLesson);

// Delete a lesson
router.delete("/:lessonId", deleteLesson);

module.exports = router;
