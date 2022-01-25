const express = require("express");
const billingController = require("../controllers/billing");
const billingRouter = express.Router();

billingRouter.route("/").post(billingController.addBilling);

billingRouter
	.route("/:billingId")
	.get(billingController.getBillingById)
	.put(billingController.updateBillingById)
	.delete(billingController.deleteBillingById);

module.exports = billingRouter;
