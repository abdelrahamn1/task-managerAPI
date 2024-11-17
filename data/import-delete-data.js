const fs = require("fs");
const mongoose = require("mongoose");
const Task = require("../models/taksModel");
require("dotenv").config();

const DB =
  "mongodb+srv://abdelrahman:GkPRxVFSPIkT8N84@cluster0.612tb.mongodb.net/taskMager?retryWrites=true&w=majority&appName=Cluster0";
console.log("Database URL:", process.env.DATABASE);
console.log("Database Password:", process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Coonected Suuccesfuly!");
  })
  .catch((err) => {
    console.log(`ERROR 💥 : ${err}`);
  });

// READ JSON FILE
const taskData = JSON.parse(
  fs.readFileSync(`${__dirname}/tasksData.json`, "utf-8")
);

const importData = async () => {
  try {
    await Task.create(taskData);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(`Error 💥 : ${err}`);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Task.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(`Error 💥 : ${err}`);
    process.exit();
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
