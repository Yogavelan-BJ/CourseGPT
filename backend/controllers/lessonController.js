const Lesson = require("../models/Lesson");
const Module = require("../models/Module");

const createLesson = async (req, res) => {
  try {
    const { lesson, moduleId } = req.body;
    const newLesson = new Lesson({
      ...lesson,
    });
    const savedLesson = await newLesson.save();
    const module = await Module.findById(moduleId);
    module.lessons.push(savedLesson._id);
    await module.save();
    res.status(201).json(savedLesson);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error Saving lesson");
  }
};

const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, req.body, {
      new: true,
    });

    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json(updatedLesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating lesson" });
  }
};

module.exports = {
  createLesson,
  updateLesson,
};
