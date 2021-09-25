const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const taskSchema = new Schema(
	{
		department: {
			type: String,
			required: true,
		},
		instruction: {
			type: String,
			required: true,
			unique: true,
			validate: [(value) => value.length > 0, "Instruction required"],
		},
	},
	{
		timestamps: true,
		autoCreate: true,
		autoIndex: true,
	}
);

const taskModel = model("task", taskSchema);
module.exports = taskModel;
