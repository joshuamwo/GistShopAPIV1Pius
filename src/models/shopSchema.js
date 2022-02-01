const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const decode = require("../shared/base64");

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
			required: true,
		},
		description: value,
		userId: {
			type: Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
	},
	{ timestamps: true, autoCreate: true, autoIndex: true }
);

shopSchema.pre("save", function (next) {
	//store in folder
	decode(this.image, this._id);
	const shop = this;
	const image = `${shop._id}.png`;

	this.image = image;
	next();
});


shopSchema.pre("findOneAndUpdate", function (next) {
	const shop = this;
   if(this._update.image){
      decode(this._update.image, this._conditions._id);
      const image = `${this._conditions._id}.png`;
      this._update.image = image;
   }
	next();
});

const shops = model("shop", shopSchema);

module.exports = shops;
