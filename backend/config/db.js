const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://yogavelan:UqUf5VB4AA8Jx9M0@chat-app.c6bp55p.mongodb.net/CourseGPT?retryWrites=true&w=majority"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
