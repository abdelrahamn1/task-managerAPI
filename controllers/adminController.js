const User = require("../models/userModel");

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: "succes",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ active: true });
    if (users.length === 0) return res.status(200).send("Not Found any users!");
    res.status(200).json({
      status: "succes",
      result: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        message: "There is no User!",
      });
    } else {
      res.status(200).json({
        status: "succes",
        data: {
          user,
        },
      });
    }
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(400).json({
        status: "fail",
        message: "No user found for this id!",
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: err,
      });
    }
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userUpdated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    const updatedFields = Object.keys(req.body).join(" ");
    res.status(200).json({
      status: `The [${updatedFields}] successfuly updated!`,
      data: {
        userUpdated,
      },
    });
  } catch (err) {
    if (err.kind === "ObjectId") {
      res.status(400).json({
        status: "fail",
        message: "No user found for this id!",
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      data: null,
      message: "User deleted succesfuly!",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
