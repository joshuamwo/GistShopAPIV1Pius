const mongoose = require("mongoose");
const { Schema, model } = mongoose;
require("mongoose-currency").loadType(mongoose);

const value = {
	type: String,
	required: [true, "This field is required"],
};



const shopSchema = new Schema(
	{
		name: {
			type: String,
			unique: true,
			required: "Please insert the name of the shop",
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			required: "Email address is required",
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"Please fill a valid email address",
			],
		},
		location: value,
		phoneNumber: {
			type: String,
			max: 15,
			min: 10,
			required: "Phone number is required",
		},
		image: {
			type: String,
			required:  "Image photo is required",
		},
		description: value,
		userId: {
			type: Schema.Types.ObjectId,
			ref: "user"
		},
	},
	{ timestamps: true, autoCreate: true, autoIndex: true }
);

const shops = model("shop", shopSchema);

module.exports = shops;
