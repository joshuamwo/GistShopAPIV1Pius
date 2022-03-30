var mongoose = require("mongoose");
var productModel = require("../models/productSchema");

exports.getAllProducts = async (req, res) => {
	try {
		let products = await productModel
			.find({available: {$ne: false}})
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
			.find({ $and: [
				{shopId: req.params.shopId },
				{available: {$ne: false}}
			]})
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
		let products = await productModel.find({ 
			$and: [
				{ownerId: req.params.userId},
				{available: {$ne: false}}
			] })
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

exports.productQtyCheck = async (req, res) => {
	let product = await productModel.findById(req.body.productId)
	if(product.quantity < req.body.quantity){ 
		return res.send({"status":false, "qty":product.quantity}); 
	}
	return res.send({"status":true, "qty":product.quantity}); 
}


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
		newProd.shopId = null;
		newProd.ownerId = null;

		res.status(200).setHeader("Content-Type", "application/json").json({ "success": true, data: newProd });
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};

exports.searchForProduct = async function (req, res) {
	try {
  
	const products = await productModel.find({
	name: { $regex: req.params.name, $options: "i" }})
	.populate("shopId", [
					'name','email','location','phoneNumber','image','description','open','ownerId'
				]).populate("ownerId", [
		"firstName",
		"lastName",
		"bio",
		"userName",
		"email",
	]).limit(20)
  
	  res.json(products);
	} catch (error) {
	  res.status(404).send(error);
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

		newProduct.shopId = null;
		newProduct.ownerId = null;
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
			{ $addToSet: newObj},
			{ runValidators: true, new: true }
		);

		newProduct.shopId = null;
		newProduct.ownerId = null;
		
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
		let deleted = await productModel.findOneAndRemove({_id: req.params.productId});
		res.status(200).setHeader("Content-Type", "application/json").json(deleted);
	} catch (error) {
		res
			.status(422)
			.setHeader("Content-Type", "application/json")
			.json(error.message);
	}
};
