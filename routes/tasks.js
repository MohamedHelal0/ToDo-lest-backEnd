const ex = require("express");
const router = ex.Router();
const {
  getAllTasks,
  createTask,
  deleteTask,
  TaskPage
} = require("../controllers/taskController");

router.route('/').get(TaskPage)

router.route("/tasks").get(getAllTasks).post(createTask);
router.route("/tasks/:taskId").delete(deleteTask);

module.exports = router;
