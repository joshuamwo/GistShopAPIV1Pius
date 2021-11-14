const express = require("express");
var workerRouter = express.Router();
var workerController = require("../CONTROLLERS/workers");

workerRouter
  .route(`/`)
  .get(workerController.getAllWorkers)
  .post(workerController.addWorker);

workerRouter
  .route("/:workerId")
  .get(workerController.getWorkerById)
  .put(workerController.editWorkerById)
  .delete(workerController.deleteWorkerById);

module.exports = workerRouter;
