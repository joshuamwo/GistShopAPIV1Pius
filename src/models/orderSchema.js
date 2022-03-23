const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, required: true, ref: "user" },

    shippingId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "address",
    },
    status: {
      type: String,
      enum: ["pending", "cancelled", "shipped", "delivered"],
      default: "pending",
    },
    shopId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    date: {
      type: Number,
      default: Date.now(),
      required: true
    },
    itemId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "item",
    },
    subTotal: { type: Number, required: true },
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
  }
);

const orders = model("order", orderSchema);

/*......................................
   *pre hook that saves the objectId of the order Schema in the quantity schema
   *
   *
   ......................................*/

module.exports = orders;
