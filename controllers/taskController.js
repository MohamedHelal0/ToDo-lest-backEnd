const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { Task, validateCreateTask } = require("../models/task");
const { User } = require("../models/user");

const getAllTasks = asyncHandler(async (req, res) => {

  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Missing or invalid token" });
  }

  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { email, id } = decoded;

      if (email === user.email) {
        if (!user.tasks || user.tasks.length === 0) {
          return res.status(200).render("index", { allTasks: [] });
        }

        const allTasks = await Task.find({ _id: { $in: user.tasks } });
        return res.status(200).render("index", { allTasks: allTasks });
      } else {
        return res.status(401).json({ message: "Unauthorized: You do not have permission to access this user's tasks" });
      }
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).render("login");
  }
});


const createTask = asyncHandler(async (req, res) => {
  let user = await User.findOne({ _id: req.params.userID });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing or invalid token" });
  }

  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { email, id } = decoded;

      if (email === user.email) {
        const { error } = validateCreateTask(req.body);
        if (error) {
          return res.status(400).send(error.details[0].message);
        }

        const createTaskFields = {
          content: req.body.content,
          active: req.body.active,
        };

        const newTask = new Task(createTaskFields);
        user.tasks.unshift(newTask._id);
        await user.save();
        const savedTask = await newTask.save();
        return res.status(201).json(savedTask);
      } else {
        return res.status(401).json({ message: "Invalid email" });
      }
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Access denied" });
  }
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).send("The task with the given ID was not found");
  }

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing or invalid token" });
  }

  const token = req.headers.authorization.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { email, id } = decoded;

      if (email === task.ownerEmail) {
        await Task.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "The task was deleted" });
      } else {
        return res
          .status(401)
          .json({
            message:
              "Unauthorized: You do not have permission to delete this task",
          });
      }
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Access denied" });
  }
});

module.exports = {
  getAllTasks,
  createTask,
  deleteTask,
};
