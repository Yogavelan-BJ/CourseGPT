const Lesson = require("../models/Lesson");

const createLesson = async (req, res) => {
  try {
    const { lesson, user, moduleId } = req.body;
    const newLesson = new Lesson(lesson);
    console.log(user, moduleId);
    NL = await newLesson.save();

    res.status(201).json({ id: NL._id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error Saving lesson");
  }
};

module.exports = {
  createLesson,
};
