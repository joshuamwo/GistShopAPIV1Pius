var mongoose = require("mongoose");
var orderModel = require("../models/orderSchema");

exports.getAllOrdersByUserId = async (req, res) => {
	try {
		let orders = orderModel.find({
			customerId: mongoose.mongo.ObjectId(req.params.userId),
		});
		res.status(200).setHeader("Content-Type", "application/json").json(orders);
	} catch (error) {
		res
			.status(error.statusCode)
			.setHeader("Content-Type", "application/json")
			.json(e.message);
	}
};

exports.addOrder = async (req, res) => {
	let newObj = {
		customerId: req.params.userId,
		billingId: req.body.billingId,
		shippingId: req.body.shippingId,
		productIds: req.body.productIds,
		subTotal: req.body.subTotal,
		tax: req.body.tax,
		shippingFee: req.body.shippingFee,
		total: req.body.tax + req.body.shippingFee + req.body.subtotal,
	};

	try {
		let newOrder = await orderModel.create(newObj);
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json(newOrder);
	} catch (e) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(e.message);
	}
};

exports.updateOrderById = async (req, res) => {
	let newProductIds = [];
	req.body.productIds.forEach((id) => id);
	let newObj = {
		billingId: req.body?.billingId,
		shippingId: req.body?.shippingId,

		subtotal: req.body?.subtotal,
		tax: req.body?.tax,
		shippingFee: req.body?.shippingFee,
	};

   const update = {
			// $push: { productIds: req.body.productIds },
			$set: { billingId: req.body?.billingId },
			$set: { shippingId: req.body?.shippingId },
			$set: { subtotal: req.body?.subtotal },
			$set: { tax: req.body?.tax },
			$set: { shippingFee: req.body?.shippingFee,},
		};

	try {
		let newOrder = await orderModel.findByIdAndUpdate(
			req.params.orderId,
			{ $push: { productIds: req.body.productIds }, $set: update },
			{ runValidators: true, new: true }
		);
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json(newOrder);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "Application/json")
			.json(error.message);
	}
};

exports.getOrderById = async (req, res) => {
	try {
		let order = await orderModel.findById(req.params.orderId);
		res.status(200).setHeader("Content-Type", "application/json").json(order);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "Application/json")
			.json(error.message);
	}
};

exports.deleteProductById = async (req, res) => {
	try {
		await orderModel.findByIdAndDelete(req.params.orderId);
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json("Deleted successfully");
	} catch (e) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(e.message);
	}
};
