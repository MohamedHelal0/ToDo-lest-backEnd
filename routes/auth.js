const express = require("express");
const {
  login,
  register,
  getLoginPage,
  getRegisterPage,
  getForgotPasswordPage,
  sendForgotPasswordLink,
  getResetPasswordPage,
  resetThePassword,
} = require("../controllers/authController");
const router = express.Router();

// /auth/register
router.route("/register").get(getRegisterPage).post(register);

// /auth/login
router.route("/login").get(getLoginPage).post(login);

router
  .route("/forgot-password")
  .get(getForgotPasswordPage)
  .post(sendForgotPasswordLink);

router
  .route("/reset-password/:userId/:token")
  .get(getResetPasswordPage)
  .post(resetThePassword);

module.exports = router;
