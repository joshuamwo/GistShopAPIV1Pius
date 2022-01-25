const mongoose = require("mongoose");
const { Schema, model } = mongoose;
require("mongoose-currency").loadType(mongoose);

const orderSchema = new Schema(
	{
		customerId: { type: mongoose.Types.ObjectId, required: true },
		billingId: { type: mongoose.Types.ObjectId, required: true },
		shippingId: { type: mongoose.Types.ObjectId, required: true },
		productIds: [{ type: mongoose.Types.ObjectId }],

		subTotal: { type: mongoose.Types.Currency, required: true },
		tax: { type: mongoose.Types.Currency, required: true },
		shippingFee: { type: mongoose.Types.Currency, required: true },
		totalCost: {
			type: mongoose.Types.Currency,
			default: function () {
				return this.subTotal + this.tax + this.shippingFee;
			},
		},
	},
	{
		timestamps: true,
		autoIndex: true,
		autoCreate: true,
		toObject: {
			virtuals: true,
		},
		toJSON: {
			virtuals: true,
		},
	}
);

const orders = model("order", orderSchema);

module.exports = orders;
