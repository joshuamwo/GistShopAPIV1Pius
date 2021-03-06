const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const decode = require("../shared/base64");

const value = {
  type: String,
  required: true,
};

const roomSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "user",
    },
    productIds: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "product",
      },
    ],
    hostIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    userIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    title: value,
    raisedHands: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    speakerIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    invitedIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "shop",
      required: true,
    },
    productImages: {
	    type:Array
    },
    productPrice: {
    	type:Number
    }
  },
  { timestamps: true, autoIndex: true, autoCreate: true }
);


roomSchema.pre("save", function (next) {
	//store in folder
	decode(this.productImages, this._id);
	const product = this;
	const images = product.productImages.map(
		(img) => `${product.productImages.indexOf(img)}_${this._id}.png`
	);
	this.productImages = images;
	next();
});

roomSchema.pre("findOneAndUpdate", function (next) {
	const product = this;

	if (this._update.productImages) {
		decode(this._update.productImages, this._conditions._id);
		const images = product._update.productImages.map(
			(img) =>
				`${product._update.productImages.indexOf(img)}_${this._conditions._id}.png`
		);
		this._update.productImages = images;
	}

	next();
});

const roomModel = model("rooms", roomSchema);
module.exports = roomModel;
