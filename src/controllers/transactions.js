const transactionModel = require("../models/transactionSchema");
const mongoose = require("mongoose");
const userModel = require("../models/userSchema");

exports.getUserTransactionsByUserId = async (req, res) => {
	try {
		let transactions = await transactionModel
			.find({
				$or: [{ to: req.params.userId }],
			})
			.sort({date: 1})
			.populate("from", ["firstName", "lastName", "bio", "userName", "email"])
			.populate("to", ["firstName", "lastName", "bio", "userName", "email"])
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json(transactions);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.createTransaction = async (req, res) => {
	let newTransaction = {
		from: req.body.from,
		to: req.body.to,
		reason: req.body.reason,
		amount: req.body.amount,
		type: req.body.type,
		deducting: req.body.deducting,
      shopId: req.body.shopId,
	  date: Date.now()
	};
	try {
		if (newTransaction.type === "purchase") {
			await userModel.findByIdAndUpdate(req.params.userId, {
				$inc: { wallet: -newTransaction.amount },
			});
		}

		let transaction = await transactionModel.create(newTransaction);
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json(transaction);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.getTransactionById = async (req, res) => {
	try {
		let trans = await transactionModel.findById(req.params.transId);
		res.status(200).setHeader("Content-Type", "application/json").json(trans);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.getTransactionByShopId = async (req, res) => {
   	try {
			let trans = await transactionModel.find({shopId: req.params.shopId}).populate("shopId");
			res.status(200).setHeader("Content-Type", "application/json").json(trans);
		} catch (error) {
			res
				.status(422)
				.setHeader("Content-Type", "application/json")
				.json(error.message);
		}
}
