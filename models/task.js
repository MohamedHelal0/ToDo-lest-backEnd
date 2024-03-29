const mongoose = require("mongoose");
const Joi = require("joi");

const TaskSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const validateCreateTask = (task) => {
  const schema = Joi.object({
    content: Joi.string().trim().min(1).required(),
    active: Joi.boolean()
  });
  return schema.validate(task);
};

module.exports = {
  Task: mongoose.model("Task", TaskSchema),
  validateCreateTask,
};
