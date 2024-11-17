const Task = require("../models/taksModel");

exports.getAllTasks = async (req, res) => {
  try {
    // Step 1: Add user filter
    const filterableFields = { ...req.query, user: req.user._id }; // Ensures tasks belong to the logged-in user
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((field) => delete filterableFields[field]);

    // Step 2: Build the initial query
    let query = Task.find(filterableFields);

    // Step 3: Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("createdAt"); // Default sorting by creation time
    }

    // Step 4: Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v"); // Exclude `__v` by default
    }

    // Step 5: Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute the query
    const tasks = await query;

    // Response
    res.status(200).json({
      status: "success",
      result: tasks.length,
      data: {
        tasks,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message || "An error occurred while retrieving tasks.",
    });
  }
};

exports.createTasks = async (req, res) => {
  try {
    const newTask = await Task.create({ ...req.body, user: req.user._id });

    res.status(201).json({
      status: "succes",
      data: {
        task: newTask,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).select("-_id -user");
    if (!task) {
      res.status(404).json({
        message: "There is no task!",
      });
    } else {
      res.status(200).json({
        status: "succes",
        data: {
          task,
        },
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskUpdated = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!taskUpdated) {
      res.status(403).json({
        status: "fail",
        message: "You are not authorized to perform this operation!",
      });
    }
    res.status(200).json({
      status: "succes",
      data: {
        taskUpdated,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deleteTask = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleteTask) {
      res.status(403).json({
        status: "fail",
        message: "You are not authorized to perform this operation!",
      });
    }

    res.status(204).json({
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
