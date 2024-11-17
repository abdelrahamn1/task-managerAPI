const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provaid a Valid name"],
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Email cannot be empty"],
    validate: [validator.isEmail, "Please Provide a Valid Email"],
    unique: [true, "The email you provide is exit!"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  password: {
    type: String,
    required: [true, "Password can not be empty"],
    minlength: [8, "The password nust be above 8 character"],
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "Please Confirm your password !"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords dosen't match",
    },
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToekn = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToekn)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToekn;
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
