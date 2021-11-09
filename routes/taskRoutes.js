const express = require("express");
var taskRouter = express.Router();
var taskController = require("../controllers/tasks");

taskRouter
    .route("/")
    .post(taskController.postTask);

taskRouter
  .route(`/departments/:department`)
  .get(taskController.getTasks);
  

taskRouter
  .route("/:taskId")
  .get(taskController.getTaskById)
  .put(taskController.editTask)
  .delete(taskController.deleteTask);

module.exports = taskRouter;
