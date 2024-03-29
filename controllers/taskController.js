const asyncHandler = require("express-async-handler");
const { Task, validateCreateTask } = require("../models/task");

const getAllTasks = asyncHandler(async (req, res) => {
  const allTasks = await Task.find();
  const doneTasks = await Task.find({ active: true });
  res.status(200).render("index", { allTasks: allTasks, doneTasks: doneTasks });
});

const createTask = asyncHandler(async (req, res) => {
  const { error } = validateCreateTask(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const createBookFields = {
    content: req.body.content,
    active: req.body.active,
  };
  const newTask = new Task(createBookFields);
  const savedBook = await newTask.save();
  res.status(201).json(savedBook);
});

const deleteTask = asyncHandler(async (req, res) => {

  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).send("The task with the given ID was not found");
  } else {
      await Task.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "The task was deleted" });
  }
});

module.exports = {
  getAllTasks,
  createTask,
  deleteTask,
};
