const mongoose = require("mongoose");
const { Schema, model } = mongoose;

var validateEmail = function (email) {
	var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return re.test(email);
};

const logSchema = new Schema(
	{
		email: {
			type: String,
			trim: true,
			lowercase: true,
			required: "Email address is required",
			validate: [validateEmail, "Please fill a valid email address"],
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"Please fill a valid email address",
			],
		},
		name: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			// required: true,
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
