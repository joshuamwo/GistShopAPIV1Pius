const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/products");

const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
	allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

let upload = multer({ storage, fileFilter });
const passport = require("passport");

require("../services/authenticate");

productRouter.route("/").get(productController.getAllProducts);

productRouter
	.route("/:shopId")
	.get(productController.getAllProductsByShopId)
	.post(
		passport.authenticate("jwt", { session: false }),
		upload.any("image"),
		productController.addProductToShop
	);

productRouter
	.route("/products/:productId")
	.get(productController.getProductById)
	.put(
		passport.authenticate("jwt", { session: false }),
		upload.any("image"),
		productController.updateProductById
	)
	.delete(
		passport.authenticate("jwt", { session: false }),
		productController.deleteProductById
	);

productRouter
	.route("/get/all/:userId")
	.get(
		passport.authenticate("jwt", { session: false }),
		productController.getAllProductsByUserId
	);
productRouter
	.route("/products/products/recent")
	.get(productController.getRecentProducts);

module.exports = productRouter;
