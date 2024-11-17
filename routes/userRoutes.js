const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

//handel login and signUp
router.route("/login").post(authController.LogIn);
router.route("/signup").post(authController.signUp);

//handel password
router.route("/forgetpassword").post(authController.forgetPassword);
router.route("/resetpassword/:token").post(authController.resetpassword);

//handel user info.
router
  .route("/me")
  .get(authController.protect, userController.Myinfo)
  .post(authController.protect, userController.UpdateMe)
  .delete(authController.protect, userController.deleteMe);

//handel user tasks
// router
//   .route("/mytask")
//   .get(authController.protect, userController.getUserTasks)
//   .post(authController.protect, userController.createTask);

// handel user ifon by admin only
router
  .route("/")
  .get(
    authController.protect,
    authController.ristrected("admin"),
    adminController.getAllUsers
  )
  .post(
    authController.protect,
    authController.ristrected("admin"),
    adminController.createUser
  );
router
  .route("/:id")
  .get(
    authController.protect,
    authController.ristrected("admin"),
    adminController.getUser
  )
  .patch(
    authController.protect,
    authController.ristrected("admin"),
    adminController.updateUser
  )
  .delete(
    authController.protect,
    authController.ristrected("admin"),
    adminController.deleteUser
  );

module.exports = router;
