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
		
		description: 
			{
				type: String,
			},
		shopId: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: "shop",
		},
		ownerId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "user",
		},
	},
	{ timestamps: true, autoIndex: true, autoCreate: true }
);

productSchema.pre("save", function (next) {

	var now = Date.now()

	//store in folder
	decode(this.images, this._id, now);
	const product = this;
	const images = product.images.map(
		(img) => `${now}${product.images.indexOf(img)}_${this._id}.png`
	);
	this.images = images;
	next();
});

productSchema.pre("findOneAndUpdate", function (next) {
	const product = this;
	var now = Date.now()
	
	console.log(this._update)

	if (this._update.$push != null) {
		decode(this._update.$push.images, this._conditions._id, now);
		const images = product._update.$push.images.map(
			(img) =>
			`${now}${product._update.$push.images.indexOf(img)}_${this._conditions._id}.png`
			);
		this._update.$push.images = images;
		
	}else if (this._update.$set.images != null) {
		decode(this._update.$set.images, this._conditions._id, now);
		const images = product._update.$set.images.map(
			(img) =>
				`${now}${product._update.$set.images.indexOf(img)}_${this._conditions._id}.png`
		);
		this._update.$set.images = images;
	}

	next();
});

const products = model("product", productSchema);

module.exports = products;
