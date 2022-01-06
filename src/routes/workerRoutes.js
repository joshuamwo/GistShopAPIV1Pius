const express = require("express");
const workerRouter = express.Router();
const workerController = require("../controllers/workers");
const path = require("path");

const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

let upload = multer({ storage, fileFilter });

workerRouter
  .route(`/`)
  .get(workerController.getAllWorkers)
  .post(upload.single("profilePicture"), workerController.addWorker);

workerRouter
  .route("/:workerId")
  .get(workerController.getWorkerById)
  .put(upload.single("profilePicture"), workerController.editWorkerById)
  .delete(workerController.deleteWorkerById);

module.exports = workerRouter;
