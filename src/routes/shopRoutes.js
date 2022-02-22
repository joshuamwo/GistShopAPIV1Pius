const express = require("express");
const shopRouter = express.Router();
const shopController = require("../controllers/shop");

const passport = require("passport");

require("../services/authenticate");



const multer = require("multer");

const storage = multer.memoryStorage();



const fileFilter = (req, file, cb) => {
	const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
	allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

let upload = multer({ storage, fileFilter });

shopRouter.route("/").get(shopController.getAllShops);

shopRouter
	.route("/:userId")
	.get(
		passport.authenticate("jwt", { session: false }),
		shopController.getAllShopsByUserId
	)
	.post(
		upload.single("image"),
		passport.authenticate("jwt", { session: false }),
		shopController.createShop
	);

shopRouter
	.route("/shop/:shopId")
	.get(shopController.getShopById)
	.put(
		upload.single("image"),
		passport.authenticate("jwt", { session: false }),
		shopController.updateShopById
	)
	.delete(
		passport.authenticate("jwt", { session: false }),
		shopController.deleteShopById
	);

	shopRouter
	.route("/search/:name")
	.get(shopController.searchForShop)

module.exports = shopRouter;
