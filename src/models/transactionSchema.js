const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const value = {
	type: String,
	required: true,
};


const transactionSchema = new Schema({
   from: { 
      type: Schema.Types.ObjectId,
      required: true,
   },
   to: { 
      type: Schema.Types.ObjectId,
      required: true,
   },
   shopId: { 
      type: Schema.Types.ObjectId,
      required: true,
   },
   reason: value,
   amount: {
      type: Number,
      required: true,
   },
   type: {
      type: String,
      enum: ["purchase", "sending"],
      required: true,
   },
   deducting: {
      type: Boolean,
      required: true, 
   }
},{timestamps: true, autoIndex: true, autoCreate: true});

const transactionModel = model("transaction", transactionSchema);

module.exports = transactionModel