const ex = require("express");
const router = ex.Router();
const {
  getAllTasks,
  createTask,
  deleteTask,
} = require("../controllers/taskController");

router.route("/tasks").get(getAllTasks).post(createTask);
router.route("/tasks/:id").delete(deleteTask);

module.exports = router;
