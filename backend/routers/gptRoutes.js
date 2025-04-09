const { Router } = require("express");
const { generateLesson } = require("../controllers/gptController");
const router = Router();

router.post("/generate-lesson", generateLesson);

module.exports = router;
