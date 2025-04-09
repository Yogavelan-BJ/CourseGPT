const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Module = mongoose.model("Module", moduleSchema);

module.exports = Module;
