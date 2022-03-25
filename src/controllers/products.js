var mongoose = require("mongoose");
var productModel = require("../models/productSchema");

exports.getAllProducts = async (req, res) => {
	try {
		let products = await productModel
			.find()
			.populate("shopId", ["image", "open"])
			.populate("ownerId", ["userName"]);
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json(products);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.getAllProductsByShopId = async (req, res) => {
	try {
		let products = await productModel
			.find({ shopId: req.params.shopId })
			.populate("shopId", ["image", "open"])
			.populate("ownerId", ["userName"]);
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json(products);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.getAllProductsByUserId = async (req, res) => {
	try {
		let products = await productModel.find({ ownerId: req.params.userId })
			.populate("shopId", ["image", "open"])
			.populate("ownerId", ["userName"]);
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json(products);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.addProductToShop = async (req, res) => {
	const newProduct = {
		name: req.body.name,
		price: req.body.price,
		quantity: req.body.quantity,
		images: req.body.images,
		shopId: mongoose.mongo.ObjectId(req.params.shopId),
		ownerId: req.body.ownerId,
		description: req.body.description,
		variations: req.body.variations.split(",")
	};

	try {
		let newProd = await productModel.create(newProduct);
		res.status(200).setHeader("Content-Type", "application/json").json({ "success": true, data: newProd });
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.getProductById = async (req, res) => {
	try {
		let product = await productModel.findById(req.params.productId)
			.populate("shopId", ["image", "open"])
			.populate("ownerId", ["userName"])
		res.status(200).setHeader("Content-Type", "application/json").json(product);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.updateProductById = async (req, res) => {
	if (req.body.variations) {
		req.body.variations = req.body.variations.split(",");
	}
	let newObj = req.body;
	try {
		let newProduct = await productModel.findByIdAndUpdate(
			req.params.productId,
			{ $set: newObj }
		);
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json({ "success": true, data: newProduct });
	} catch (error) {
		console.log(error)
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.updateProductImages = async (req, res) => {
	let newObj = {
		images: req.body.images
	};
	try {
		let newProduct = await productModel.findByIdAndUpdate(
			req.params.productId,
			{ $addToSet: req.body.images },
			{ runValidators: true, new: true }
		);
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json(newProduct);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.deleteProductById = async (req, res) => {
	try {
		let deleted = await productModel.findByIdAndDelete(req.params.productId);
		res.status(200).setHeader("Content-Type", "application/json").json(deleted);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};
