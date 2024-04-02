const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { Task, validateCreateTask } = require("../models/task");
const { User } = require("../models/user");

const TaskPage = asyncHandler(async (req, res) => {
  res.render("index");
});

const getAllTasks = asyncHandler(async (req, res) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    console.log("No token found");
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing or invalid token" });
  }

  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { email, id } = decoded;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email !== user.email) {
      return res.status(401).json({
        message:
          "Unauthorized: You do not have permission to access this user's tasks",
      });
    }

    if (!user.tasks || user.tasks.length === 0) {
      // Here you can render a view with no tasks
      return res.json({ tasks: [] });
    }

    const allTasks = await Task.find({ _id: { $in: user.tasks } });
    // Pass the tasks to the render function
    return res.json({ tasks: allTasks });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

const createTask = asyncHandler(async (req, res) => {
  const { userID } = req.params;

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing or invalid token" });
  }

  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { email } = decoded;

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email !== user.email) {
      return res.status(401).json({
        message:
          "Unauthorized: You do not have permission to create tasks for this user",
      });
    }

    const { error } = validateCreateTask(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newTask = new Task({
      content: req.body.content,
      active: req.body.active,
      owner: userID,
    });

    await newTask.save();
    user.tasks.push(newTask);
    await user.save();

    return res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing or invalid token" });
  }

  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { id: userId } = decoded;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (userId !== task.owner.toString()) {
      return res.status(401).json({
        message: "Unauthorized: You do not have permission to delete this task",
      });
    }

    await Task.findByIdAndDelete(id);
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = {
  getAllTasks,
  createTask,
  deleteTask,TaskPage
};
