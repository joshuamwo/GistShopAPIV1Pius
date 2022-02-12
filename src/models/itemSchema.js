const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderItems = Schema(
	{
		orderId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "order",
		},
		quantity: {
			type: Number,
			required: true,
		},
		productId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "product",
		},
	},
	{ timestamps: true, autoCreate: true, autoIndex: true }
);

const items = model("item", orderItems);
module.exports = items;
