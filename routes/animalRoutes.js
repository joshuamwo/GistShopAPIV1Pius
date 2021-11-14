const express = require("express");
var animalRouter = express.Router();
var animalController = require("../CONTROLLERS/animals");

animalRouter
  .route(`/:department`)
  .get(animalController.getAnimalsByDept)

  .post(animalController.addAnimalToDept);

animalRouter
  .route("/:department/:animalId")
  .get(animalController.getAnimalById)
  .put(animalController.editAnimalById)

  .delete(animalController.deleteAnimalById);

module.exports = animalRouter;
