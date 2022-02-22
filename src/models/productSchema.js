const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const decode = require("../shared/base64");

const value = {
	type: String,
	required: [true, "This field is required"],
};

const productSchema = new Schema(
	{
		name: value,
		price: {
			type: Number,
			required: "Price field is required",
		},
		quantity: {
			type: Number,
			min: 0,
			required: true,
		},
		images: 
			{
				type: Array,
			},
		
		shopId: {
			type: mongoose.Types.ObjectId,
			required: true,
         ref: "shop"
		},
		ownerId: {
			type: Schema.Types.ObjectId,
			required: true,
         ref: "user"
		},
	},
	{ timestamps: true, autoIndex: true, autoCreate: true }
);

productSchema.pre("save", function (next) {
	//store in folder
	decode(this.images, this._id);
	const product = this;
	const images = product.images.map(
		(img) => `${product.images.indexOf(img)}_${this._id}.png`
	);
	this.images = images;
	next();
});

productSchema.pre("findOneAndUpdate", function (next) {
	const product = this;

	if (this._update.images) {
		decode(this._update.images, this._conditions._id);
		const images = product._update.images.map(
			(img) =>
				`${product._update.images.indexOf(img)}_${this._conditions._id}.png`
		);
		this._update.images = images;
	}

	next();
});

const products = model("product", productSchema);

module.exports = products;
