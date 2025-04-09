const Module = require("../models/Module");
const User = require("../models/User");
const Lesson = require("../models/Lesson");

const createModule = async (req, res) => {
  try {
    const { name, userId } = req.body;

    const module = new Module({
      name,
    });

    const savedModule = await module.save();

    const updatedUser = await User.findOneAndUpdate(
      { firebaseId: userId },
      { $addToSet: { modules: savedModule._id } },
      { new: true }
    );

    if (!updatedUser) {
      console.log("User not found");
    } else {
      console.log("Updated user:", updatedUser);
    }

    res.status(201).json(savedModule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserModules = async (req, res) => {
  try {
    const { userId } = req.params;
    const modules = await User.findOne({ firebaseId: userId }).populate(
      "modules"
    );
    console.log(modules);
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getModuleLessons = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const module = await Module.findById(moduleId).populate();
    let lessons = [];
    for (let i of module.lessons) {
      const lesson = await Lesson.findById(i);
      lessons.push(lesson);
    }
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single module by ID
const getModuleById = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const module = await Module.findById(moduleId).populate();
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createModule,
  getUserModules,
  getModuleLessons,
  getModuleById,
};
