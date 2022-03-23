var orderModel = require("../models/orderSchema");
const mongoose = require("mongoose");
const itemModel = require("../models/itemSchema");
const userModel = require("../models/userSchema");
const transactionModel = require("../models/transactionSchema");
const shopModel = require("../models/shopSchema");

const utils = require("../../utils");
const functions = require("../shared/functions")


exports.getAllOrdersBySeller = async (req, res) => { };

exports.getAllOrdersByUserId = async (req, res) => {
	try {
		let orders = await orderModel
			.find({
				customerId: req.params.userId,
			})
			.populate("customerId", [
				"firstName",
				"lastName",
				"bio",
				"userName",
				"email",
			]).populate({
				path: "itemId",
				populate: {
					path: "productId",
					select: ["name", "images"],
					model: "product",
				},
			})
			.populate("billingId")
			.populate("shippingId")
			.sort({date: -1});

		res.status(200).setHeader("Content-Type", "application/json").json(orders);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.getOrderByProductId = async (req, res) => {
	try {
		let orders = await orderModel
			.find({ productIds: req.params.productId })
			.populate("productId");
		res.status(200).setHeader("Content-Type", "application/json").json(orders);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.getOrderByShopId = async (req, res) => {
	try {
		let orders = await orderModel.find({ shopId: req.params.shopId });
		res.status(200).setHeader("Content-Type", "application/json").json(orders);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.addOrder = async (req, res) => {
	let newOrder;
	let newItem;

	try {
		Promise.all(
			req.body.order.map(async (item) => {
				let orderId = new mongoose.Types.ObjectId();
				let itemId = new mongoose.Types.ObjectId();

				let productShop = await shopModel.findById(item.shopId)

				let total = parseFloat(item.tax) + parseFloat(item.shippingFee) + parseFloat(item.subTotal);

				{
					/*......................................
			   *
			......................................*/
				}
				newOrder = await orderModel.create({
					_id: orderId,
					customerId: req.params.userId,
					shippingId: item.shippingId,
					shopId: item.shopId,
					subTotal: item.subTotal,
					tax: item.tax,
					shippingFee: item.shippingFee,
					total,
					itemId,
					productId: item.productId,
					quantity: item.quantity,
					date: Date.now()
				});
				{
					/*......................................
				*
			......................................*/
				}
				newItem = await itemModel.create({
					_id: itemId,
					productId: item.productId,
					quantity: item.quantity,
					orderId,
				});
				{
					/*......................................
				*save transaction to the customer
			......................................*/
				}
				let newTransaction = {
					from: item.productOwnerId,
					to: req.params.userId,
					reason: utils.Transactionreasons.PURCHASED,
					amount: total,
					type: "purchase",
					deducting: true,
					shopId: item.shopId,
					date: Date.now()
				};
				await transactionModel.create(newTransaction);
				{
					/*......................................
				  *save transaction to the product owner
			......................................*/
				}
				let newTransaction1 = {
					from: req.params.userId,
					to: item.productOwnerId,
					reason: utils.Transactionreasons.PURCHASE,
					amount: total,
					type: "order",
					deducting: false,
					shopId: item.shopId,
					date: Date.now()
				};
				await transactionModel.create(newTransaction1);
				{
					/*......................................
					*update buyer's wallet
			......................................*/
				}
				await userModel.findByIdAndUpdate(
					req.params.userId,
					{ $inc: { wallet: parseInt(total) * -1 } },
					{ runValidators: true, new: true }
				);
				{
					/*......................................
					 *update seller's wallet
			   ......................................*/
				}
				await userModel.findByIdAndUpdate(
					item.sellerId,
					{ $inc: { wallet: parseFloat(total) } },
					{ runValidators: true, new: true }
				);


				/*......................................
				 *save activity for seller
		   ......................................*/

				functions.saveActivity(
					orderId,
					"New order",
					'OrderScreen',
					false,
					null,
					item.productOwnerId,
					"You just got an order",
					req.params.userId
				)

				/*......................................
					 *save activity for buyer
			   ......................................*/

				functions.saveActivity(
					orderId,
					"New order",
					'OrderScreen',
					false,
					null,
					req.params.userId,
					"You ordered a product from shop " + productShop.name,
					item.productOwnerId
				)
			})
		)
			.then(() => {
				res
					.status(200)
					.setHeader("Content-Type", "application/json")
					.json({ newOrder, newItem });
			})
			.catch((e) => {
				console.log(e + " ")
				res
					.status(422)
					.setHeader("Content-Type", "application/json")
					.json(e.message)
			});

	} catch (e) {

		console.log(e + " ")
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(e.message);
	}
};

exports.updateOrderById = async (req, res) => {
	let { productIds, ...setter } = req.body;

	try {
		let newOrder = await orderModel.findByIdAndUpdate(
			req.params.orderId,
			{ $set: req.body },
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
		let order = await orderModel
			.findById(req.params.orderId)
			.populate({
				path: "itemId",
				populate: {
					path: "productId",
					select: "name",
					model: "product",
				},
			})
			.populate("billingId")
			.populate("shippingId");
		// .populate("productId");
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
		let deleted = await orderModel.findByIdAndDelete(req.params.orderId);
		res.status(200).setHeader("Content-Type", "application/json").json(deleted);
	} catch (e) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(e.message);
	}
};
