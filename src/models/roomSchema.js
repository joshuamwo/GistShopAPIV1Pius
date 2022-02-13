const mongoose = require("mongoose");
const { Schema, model } = mongoose;

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
  },
  { timestamps: true, autoIndex: true, autoCreate: true }
);

const roomModel = model("rooms", roomSchema);
module.exports = roomModel;
