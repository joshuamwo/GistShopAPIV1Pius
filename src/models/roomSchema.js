const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const value = {
	type: String,
	required: true,
};

const roomSchema = new Schema(
	{
		ownerId: {
			type: String,
			required: true,
			unique: true,
		},
		productIds: [
			{
				type: String,
			},
		],
		hostIds: [
			{
				type: String,
			},
		],

		userIds: [
			{
				type: String,
			},
		],
		title: value,
		raisedHands: [
			{
				type: String,
			},
		],
		speakerIds: [
			{
				type: String,
			},
		],
		invitedIds: [
			{
				type: String,
			},
		],
		status: {
			type: Boolean,
			default: true,
		},
		shopId: {
			type: Schema.Types.ObjectId,
			required: true,
		},
	},
	{ timestamps: true, autoIndex: true, autoCreate: true }
);

const roomModel = model("rooms", roomSchema);
module.exports = roomModel;
