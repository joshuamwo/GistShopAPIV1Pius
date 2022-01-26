const mongoose = require("mongoose");
const { Schema, model } = mongoose;
require("mongoose-currency").loadType(mongoose);

const value = {
	type: String,
	required: [true, "This field is required"],
};

const productSchema = new Schema(
	{
		name: value,
		price: {
			type: mongoose.Types.Currency,
			required: "Price field is required",
		},
		quantity: {
			type: Number,
			min: 0,
			required: true,
		},
		images: [
			{
				type: String,
			},
		],
		shopId: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
      ownerId:{
         type: Schema.Types.ObjectId, required:true
      }
	},
	{ timestamps: true, autoIndex: true, autoCreate: true }
);

const products = model("product", productSchema);

module.exports = products;
