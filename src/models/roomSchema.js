const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const value = {
	type: String,
	required: true,
};

const roomSchema = new Schema(
	{
		productIds: [
			{
				type: mongoose.Types.ObjectId,
				required: true,
			},
		],
		hostIds: [
			{
				type: mongoose.Types.ObjectId,
			},
		],

		userIds: [
			{
				type: mongoose.Types.ObjectId,
			},
		],
		title: value,
		raisedhands: [
			{
				type: mongoose.Types.ObjectId,
			},
		],
		speakerIds: [
			{
				type: mongoose.Types.ObjectId,
			},
		],
		invitedIds: [
			{
				type: mongoose.Types.ObjectId,
			},
		],
		status: {
			type: boolean,
			default: true,
		},
	},
	{ timestamps: true, autoIndex: true, autoCreate: true }
);

const roomModel = model("billing", roomSchema);
module.exports = roomModel;
