const express = require("express");
const upload = require("../middleware/multer.js");
const {
  handleUserSignUp,
  handleUserLogin,
  handleUserGoogleLogin,
  handleViewProfile,
  handleAddQuestion,
  changePassword,
  sendSupportEmail,
} = require("../controllers/user_controller");
const router = express.Router();

// Sign UP & Login
router.route("/signUp").post(handleUserSignUp);
router.route("/login").post(handleUserLogin);
router.route("/googlelogin").post(handleUserGoogleLogin);
router.route("/viewProfile").post(handleViewProfile);
router.route("/handleAddQuestion").post(handleAddQuestion);
router.route("/changePassword").post(changePassword);
router.route("/support").post(sendSupportEmail);

module.exports = router;
