const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const logSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Email address is required"],
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    product: {
      type: String,
      required: [true, "The product field is required"],
    },
    amount: {
      type: Number,
      required: [true, "The amount field is required"],
    },
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);

const logs = model("log", logSchema);

module.exports = logs;
