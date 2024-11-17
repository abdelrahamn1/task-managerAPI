const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please specify a name for task"],
    minlength: [3, "The name must be above 3 character"],
  },
  description: {
    type: String,
    required: [true, "The descripion can not be empty"],
  },
  status: {
    type: String,
    enum: ["not started", "pending", "completed"],
    default: "not started",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
