const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const app = express();
const taskRouter = require("./routes/tasksRoutes");
const userRouter = require("./routes/userRoutes");
const cors = require("cors");
//midleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
//routes
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/user", userRouter);

//handeld unhandeld Routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `The ${req.originalUrl} route not Found!`,
  });
  next();
});

module.exports = app;
