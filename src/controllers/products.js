var mongoose = require("mongoose");
var productModel = require("../models/productSchema");

exports.addProductToShop = async (req, res) => {
	let images = [];
	req?.files?.forEach((pic) => images.push(pic.originalname));
	const newProduct = {
		name: req.body.name,
		price: req.body.price,
		quantity: req.body.quantity,
		images: images,
		shopId: mongoose.mongo.ObjectId(req.params.shopId),
	};

	try {
		await productModel.create(newProduct);
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json("successful");
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.getProductById = async (req, res) => {
	try {
		let product = await productModel.findById(req.params.productId);
		res.status(200).setHeader("Content-Type", "application/json").json(product);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.updateProductById = async (req, res) => {
	let newImages = [];
	req.files.forEach((pic) => newImages.push(pic.originalname));
   let newObj = req.body;
	try {
		let newProduct = await productModel.findByIdAndUpdate(
			req.params.productId,
			{ $push: { images: newImages }, $set: newObj },
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
		await productModel.findByIdAndDelete(req.params.productId);
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
