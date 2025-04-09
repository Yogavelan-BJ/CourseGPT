const Module = require("../models/Module");
const User = require("../models/User");
const Lesson = require("../models/Lesson");

// Create a new module
const createModule = async (req, res) => {
  try {
    const { name, userId } = req.body;

    // Create the module
    const module = new Module({
      name,
      userId,
    });

    const savedModule = await module.save();

    // Add module reference to user
    await User.findByIdAndUpdate(userId, {
      $push: { modules: savedModule._id },
    });

    res.status(201).json(savedModule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all modules for a user
const getUserModules = async (req, res) => {
  try {
    const { userId } = req.params;
    const modules = await Module.find({ userId }).populate("lessons");
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a lesson to a module
const addLessonToModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { name, content } = req.body;

    // Create the lesson
    const lesson = new Lesson({
      name,
      content,
      moduleId,
    });

    const savedLesson = await lesson.save();

    // Add lesson reference to module
    await Module.findByIdAndUpdate(moduleId, {
      $push: { lessons: savedLesson._id },
    });

    res.status(201).json(savedLesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all lessons in a module
const getModuleLessons = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const lessons = await Lesson.find({ moduleId });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createModule,
  getUserModules,
  addLessonToModule,
  getModuleLessons,
};
