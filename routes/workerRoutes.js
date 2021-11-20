const express = require("express");
const workerRouter = express.Router();
const workerController = require("../Controllers/workers");

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
