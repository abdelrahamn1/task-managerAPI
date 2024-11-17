const User = require("../models/userModel");
const Task = require("../models/taksModel");

exports.Myinfo = async (req, res) => {
  try {
    const user = req.user;
    if (user.active === false) {
      ``;
      return res.status(403).json({
        status: "fail",
        message: "Your Account has been deactivated!",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.UpdateMe = async (req, res) => {
  try {
    if (req.body.password)
      return res.status(400).json({
        status: "fail",
        message: '"please use password route to change password!"',
      });
    if (req.body.role)
      return res.status(400).json({
        status: "fail",
        message: '"You do not have permission to do this!!"',
      });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, email: req.body.email },
      {
        runValidators: true,
        new: true,
      }
    );
    const updatedFields = Object.keys(req.body).join(", ");
    res.status(200).json({
      status: `The [${updatedFields}] updated scuccessfuly!`,
      user,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteMe = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { active: false });

    res.status(200).json({
      status: "success",
      message: "Your account has been deactivated successfully!",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
