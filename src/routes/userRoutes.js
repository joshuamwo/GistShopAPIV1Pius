const express = require("express");
const workerRouter = express.Router();
const userController = require("../controllers/users");

const multer = require("multer");


const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

let upload = multer({ storage, fileFilter });

workerRouter
  .route(`/`)
  .get(userController.getAllWorkers)
  .post(upload.single("profilePicture"), userController.addWorker);

workerRouter
  .route("/:workerId")
  .get(userController.getWorkerById)
  .put(upload.single("profilePicture"), userController.editWorkerById)
  .delete(userController.deleteWorkerById);

module.exports = workerRouter;
