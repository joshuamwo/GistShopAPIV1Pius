const orderController = require("../controllers/orders");
const express = require("express");
const orderRouter = express.Router();

orderRouter
	.route("/:userId")
	.get(orderController.getAllOrdersByUserId)
	.post(orderController.addOrder);
orderRouter
	.route("/:userId/:orderId")
	.get(orderController.getOrderById)
	.put(orderController.updateOrderById)
	.delete(orderController.deleteProductById);

orderRouter.route("/all/shop/:shopId").get(orderController.getOrderByShopId);
orderRouter.route("/all/get/products/:productId").get(orderController.getOrderByProductId);

module.exports = orderRouter;
