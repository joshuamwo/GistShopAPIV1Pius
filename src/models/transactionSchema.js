const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const value = {
	type: String,
	required: true,
};


const transactionSchema = new Schema(
	{
		from: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "user",
		},
		to: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "user",
		},
		shopId: {
			type: Schema.Types.ObjectId,
			
         ref: "shop"
		},
		reason: value,
		
		amount: {
			type: Number,
			required: true,
		},
		type: {
			type: String,
			enum: ["purchase", "sending", "order", "upgrade"],
			required: true,
		},
		deducting: {
			type: Boolean,
			required: true,
		},
		date: {
			type: Number,
			default: 0
		}
	},
	{ timestamps: true, autoIndex: true, autoCreate: true }
);

const transactionModel = model("transaction", transactionSchema);

module.exports = transactionModel