const express = require("express");
const animalRouter = express.Router();
const animalController = require("../Controllers/animals");

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
