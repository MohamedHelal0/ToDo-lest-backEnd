const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateChangePassword,
} = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
// register
const getRegisterPage = asyncHandler(async (req, res) => {
  res.status(200).render("register");
});

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  // Validate request body
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This user is already registered." });
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    const token = savedUser.generateToken();

    // Omit sensitive information from the response
    const { password: savedPassword, ...userWithoutPassword } =
      savedUser.toObject();

    // Return user data and token
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    // Log and handle errors
    console.error("Error during registration:", error);
    if (error.name === "MongoError" && error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// login
const getLoginPage = asyncHandler(async (req, res) => {
  res.status(200).render("login");
});

const login = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordMatch) {
    return res.status(400).json({ message: "invalid email or password" });
  }
  const token = user.generateToken();

  const { password, ...other } = user._doc;

  res.status(200).json({ ...other, token });
});
// ForgotPassword

const getForgotPasswordPage = asyncHandler((req, res) => {
  res.render("forgot-password");
});

const sendForgotPasswordLink = asyncHandler(async (req, res) => {
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;
  const token = jwt.sign({ email: user.email, id: user.id }, secret);

  const link = `http://localhost:${
    process.env.PORT || 5500
  }/auth/reset-password/${user._id}/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: "Reset Password",
    html: `<div>
              <h4>Click on the link below to reset your password</h4>
              <p>${link}</p>
          </div>`,
  };

  transporter.sendMail(mailOptions, function (error, success) {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
    } else {
      console.log("Email sent: " + success.message);
      res.status(200);
    }
  });
});

const getResetPasswordPage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const secret = process.env.JWT_SECRET_KEY + user.password;
  const token = req.params.token;
  if (!token) {
    return res.status(400).json({ message: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, secret);
    res.render("reset-password");
  } catch (error) {
    console.log("JWT Verification Error:", error);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
});



const resetThePassword = asyncHandler(async (req, res) => {
  const { error } = validateChangePassword(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;
  try {
    jwt.verify(req.params.token, secret);

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user.password = req.body.password;

    await user.save();
    res.status(200);
  } catch (error) {
    console.log(error);
    res.json({ message: "Error" });
  }
});

module.exports = {
  login,
  register,
  getLoginPage,
  getRegisterPage,
  getForgotPasswordPage,
  sendForgotPasswordLink,
  getResetPasswordPage,
  resetThePassword,
};
