const express = require("express");
const shopRouter = express.Router();
const shopController = require("../controllers/shop");

const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
	allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

let upload = multer({ storage, fileFilter });

shopRouter.route("/").post(upload.single("image"),shopController.createShop);

shopRouter
	.route("/:shopId")
	.get(shopController.getShopById)
	.put(upload.single("image"),shopController.updateShopById)
	.delete(shopController.deleteShopById);

module.exports = shopRouter;