const express = require("express");
const transRouter = express.Router();
const transController = require("../controllers/transactions");


transRouter.route(`/`)
   .post(transController.createTransaction);

transRouter.route("/:userId")
   .get(transController.getUserTransactionsByUserId);

transRouter.route("/:userId/:transId")
   .get(transController.getTransactionById);

transRouter.route("/:userId/shop/:shopId")
   .get(transController.getTransactionByShopId);

module.exports = transRouter;