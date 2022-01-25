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


productRouter
	.route("/:shopId")
	.get(productController.getAllProductsByShopId)
	.post(upload.any("image"), productController.addProductToShop);

productRouter
	.route("/:shopId/:productId")
	.get(productController.getProductById)
	.put(upload.any("image"), productController.updateProductById)
	.delete(productController.deleteProductById);

module.exports = productRouter;
