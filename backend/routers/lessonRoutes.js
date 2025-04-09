const express = require("express");
const router = express.Router();
const { createLesson } = require("../controllers/lessonController.js");
router.post("/", createLesson);
module.exports = router;
