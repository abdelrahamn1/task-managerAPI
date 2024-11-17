const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");
const sendEmail = require("./emailController");

require("dotenv").config();

//singUp
exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    // Generate a JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });
    res.status(201).json({
      status: "succes",
      token: token,
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Log in
exports.LogIn = async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide an email and password!",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email }).select("+password active");
    if (user.active === false)
      return res.status(403).json({
        status: "fail",
        message: "Your account has been deleted , you canot login !",
      });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES,
    });

    res.status(200).json({
      status: "success",
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
};

exports.protect = async (req, res, next) => {
  let token, currentUser;
  try {
    //check for auth
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in! , please LogIn!",
      });
    }

    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );
    //check if user still exit or expires token
    currentUser = await User.findById(decoded.id).select("+active");

    if (!currentUser) {
      return res.status(404).json({
        message: "The user not founded",
      });
    }
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: `${
        err.message === "jwt expired"
          ? "token has been expired , please log in again!"
          : err.message
      }`,
    });
  }
};

exports.ristrected = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not allow to perform this operation!",
      });
    }
    next();
  };
};

// forget password
exports.forgetPassword = async (req, res) => {
  try {
    //get user by email
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({
        status: "fail",
        message: "Please Provide a valid email !",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", message: "No user found for this email !" });
    }

    // Generate random token and save it into database
    const resetToekn = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //send token to user email
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/resetpassword/${resetToekn}`;
    const message = `Forgot your password? Please Follow this link to reset your new password: ${resetURL}. \nIf you didn't forget your password, please ignore this email!`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Your Password reset URL (valid for 10 minutes)",
        message,
      });

      res.status(200).json({
        status: "succes",
        message: "Please Check your Email!",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      res.status(500).json({
        status: "fail",
        message: err.message,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.resetpassword = async (req, res) => {
  try {
    //get user based on the token
    const hasheToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hasheToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // check token is valid not expired
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "this link has been expired!",
      });
    }
    //set new password
    const newPassword = req.body.password;
    const newPasswordConfirm = req.body.passwordConfirm;

    if (!newPassword || !newPasswordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a new password and confirm it",
      });
    }

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      status: "succes",
      message: "Your Password has been updated successfully!",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
