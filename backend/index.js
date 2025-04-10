const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const moduleRoutes = require("./routers/moduleRoutes");
const gptRoutes = require("./routers/gptRoutes");
const lessonRoutes = require("./routers/lessonRoutes");
const { createUser } = require("./controllers/userController");
dotenv.config();

const app = express();

connectDB();
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to CourseGPT API");
});
app.use("/api/modules", moduleRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/gpt", gptRoutes);
app.post("/api/create-user", createUser);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
