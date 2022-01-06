const express = require("express");
const taskRouter = express.Router();
const taskController = require("../Controllers/tasks");

taskRouter.route("/").post(taskController.postTask);

taskRouter.route(`/departments/:department`).get(taskController.getTasks);

taskRouter
  .route("/:taskId")
  .get(taskController.getTaskById)
  .put(taskController.editTask)
  .delete(taskController.deleteTask);

module.exports = taskRouter;
