const express = require("express");
const inventoryRouter = express.Router();
const inventoryController = require("../Controllers/inventory");

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
