var mongoose = require("mongoose");
const { isExportDeclaration } = require("typescript");
var productModel = require("../models/productSchema");

exports.getRecentProducts = async (req, res) => {
   	try {
			let products = await productModel
				.find()
				.sort({ _id: -1 })
				.limit(8)
				.populate("shopId", ["image"])
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
}


exports.getAllProducts = async (req, res) => {
	try {
		let products = await productModel
			.find()
			.populate("shopId", ["image"])
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
			.populate("shopId", [
				"_id",
				"name",
				"email",
				"location",
				"phoneNumber",
				"description",
				"image",
			])
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
		let products = await productModel.find({ ownerId: req.params.userId });
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
	};

	try {
		let newProd = await productModel.create(newProduct);
		res.status(200).setHeader("Content-Type", "application/json").json(newProd);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.getProductById = async (req, res) => {
	try {
		let product = await productModel
			.findById(req.params.productId)
			.populate("ownerId", ["userName"]);
		res.status(200).setHeader("Content-Type", "application/json").json(product);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.updateProductById = async (req, res) => {
	let newObj = req.body;
	try {
		let newProduct = await productModel.findByIdAndUpdate(
			req.params.productId,
			newObj,
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
