const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const quantitySchema = Schema({
	orderId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "order",
	},
	quantity: {
		type: Number,
		required: true,
	},
},{timestamps: true,autoCreate: true,autoIndex: true});

const quantity = model("quantity", quantitySchema);
module.exports = quantity;

