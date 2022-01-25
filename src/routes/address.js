const express = require("express");
const addressController = require("../controllers/address");
const addressRouter = express.Router();

addressRouter.route("/").post(addressController.addAddress);

addressRouter
	.route("/:addressId")
	.get(addressController.getAddressById)
	.put(addressController.updateAddressById)
	.delete(addressController.deleteAddressById);

module.exports = addressRouter;