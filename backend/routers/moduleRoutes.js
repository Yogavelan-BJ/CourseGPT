const express = require("express");
const {
  createModule,
  getUserModules,
  getModuleLessons,
  getModuleById,
  deleteModule,
} = require("../controllers/moduleController");

const router = express.Router();

router.post("/", createModule);
router.get("/user/:userId", getUserModules);
router.get("/:moduleId", getModuleById);
router.delete("/:moduleId", deleteModule);
router.get("/:moduleId/lessons", getModuleLessons);

module.exports = router;
