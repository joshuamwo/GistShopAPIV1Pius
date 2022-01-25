const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/users");
const shopController = require("../controllers/shop");
const productController = require("../controllers/products");
const orderController = require("../controllers/orders");

const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
	allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

let upload = multer({ storage, fileFilter });

userRouter
	.route(`/`)
	.get(userController.getAllUsers)
	.post(upload.single("profilePicture"), userController.addUser);

userRouter
	.route("/:userId")
	.get(userController.getUserById)
	.put(upload.single("profilePicture"), userController.editUserById)
	.delete(userController.deleteUserById)
	//shop routes
	.post(upload.single("image"), shopController.createShop);

//more shop routes
userRouter
	.route("/:userId/:shopId")
	.get(shopController.getShopById)
	.put(upload.single("image"), shopController.updateShopById)
	.delete(shopController.deleteShopById)
	// product routes
	.post(upload.any("image"), productController.addProductToShop);

userRouter
	.route("/:userId/:shopId/:productId")
	.get(productController.getProductById)
	.put(upload.any("image"), productController.updateProductById)
	.delete(productController.deleteProductById);


module.exports = userRouter;
