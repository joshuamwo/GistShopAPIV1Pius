const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema(
	{
		customerId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
		billingId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "billing",
		},
		shippingId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "address",
		},
		productIds: [{ type: Schema.Types.ObjectId,ref: "product" }],
		status: {
			type: String,
			enum: ["pending", "cancelled", "shipped", "delivered"],
			default: "pending",
		},
		shopId: {
			type: Schema.Types.ObjectId,
			required: true,
		},

		subTotal: { type: Number, required: true },
		tax: { type: Number, required: true },
		shippingFee: { type: Number, required: true },
		totalCost: {
			type: Number,
			default: function () {
				return this.subTotal + this.tax + this.shippingFee;
			},
		},
	},
	{
		timestamps: true,
		autoIndex: true,
		autoCreate: true,
	}
);

const orders = model("order", orderSchema);

module.exports = orders;
