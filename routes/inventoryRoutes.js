const express = require("express");
var inventoryRouter = express.Router();
var inventoryController = require("../controllers/inventory");

inventoryRouter
  .route(`/`)
  .get(inventoryController.getAllInventoryItems)
  .post(inventoryController.addInventoryItem);

inventoryRouter
  .route("/:objectId")
  .get(inventoryController.getItemById)

  .put(inventoryController.editItemById)

  .delete(inventoryController.deleteItemById);

module.exports = inventoryRouter;
