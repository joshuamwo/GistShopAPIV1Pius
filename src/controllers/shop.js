const shopModel = require("../models/shopSchema");
var mongoose = require("mongoose");

exports.getAllShopsByUserId = async (req, res) => {
	try {
		let shops = await shopModel.find({ userId: req.params.userId });
		res.status(200).setHeader("Content-Type", "application/json").json(shops);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.createShop = async (req, res) => {
	const newShop = {
		name: req.body.name,
		email: req.body.email,
		location: req.body.location,
		phoneNumber: req.body.phoneNumber,
		image: req?.file?.originalname,
		description: req.body.description,
		userId: mongoose.mongo.ObjectId(req.params.userId),
	};

	try {
		let brandNew = await shopModel.create(newShop);
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json(brandNew);
	} catch (error) {
		res.status(422).setHeader("Content-Type", "application/json");
		if (error.code == 11000) res.json("Please pick another name");
		else {
			res.json(error.message);
		}
	}
};

exports.getShopById = async (req, res) => {
	try {
		let shop = await shopModel.findById(req.params.shopId);
		res.status(200).setHeader("Content-Type", "application/json").json(shop);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.updateShopById = async (req, res) => {
	let newObj = req.body;
	try {
		let updatedShop = await shopModel.findByIdAndUpdate(
			req.params.shopId,
			{ $set: newObj },
			{ runValidators: true, new: true }
		);

		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json(updatedShop);
	} catch (e) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(e.message);
	}
};

exports.deleteShopById = async (req, res) => {
	try {
		let del = await shopModel.findByIdAndDelete(req.params.shopId);
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json(del);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};