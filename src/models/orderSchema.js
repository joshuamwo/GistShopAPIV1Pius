const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema(
	{
		customerId: { type: mongoose.Types.ObjectId, required: true },
		billingId: { type: mongoose.Types.ObjectId, required: true },
		shippingId: { type: mongoose.Types.ObjectId, required: true },
		productIds: [{ type: mongoose.Types.ObjectId }],
		status: {
			type: String,
			enum: ["pending", "cancelled", "shipped", "delivered"],
         default: "pending"
		},
      shopId: {
         type: Schema.Types.ObjectId,
         required: true
      },

		subTotal: { type:Number, required: true },
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
		toObject: {
			virtuals: true,
		},
		toJSON: {
			virtuals: true,
		},
	}
);

const orders = model("order", orderSchema);

module.exports = orders;
