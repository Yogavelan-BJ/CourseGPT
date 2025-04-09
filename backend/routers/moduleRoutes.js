const express = require("express");
const {
  createModule,
  getUserModules,
  addLessonToModule,
  getModuleLessons,
} = require("../controllers/moduleController");

const router = express.Router();

// Module routes
router.post("/", createModule);
router.get("/user/:userId", getUserModules);

// Lesson routes
router.post("/:moduleId/lessons", addLessonToModule);
router.get("/:moduleId/lessons", getModuleLessons);

module.exports = router;
