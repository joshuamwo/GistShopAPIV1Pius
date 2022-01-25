const orderController = require("../controllers/orders");
const express = require("express");
const orderRouter = express.Router();


// order routes
orderRouter.route("/:userId")
.get(orderController.getAllOrdersByUserId)
.post(orderController.addOrder);
orderRouter
	.route("/:userId/:orderId")
	.get(orderController.getOrderById)
	.put(orderController.updateOrderById)
	.delete(orderController.deleteProductById);

module.exports = orderRouter;