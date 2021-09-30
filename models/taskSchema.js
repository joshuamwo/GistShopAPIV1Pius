const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const taskSchema = new Schema(
  {
    department: {
      type: String,
      minLength: [2, "Minimum length is 4"],
      required: [true, "The instruction is required"],
    },
    instruction: {
      type: String,
      minLength: [4, "Minimum length is 4"],
      required: [true, "The instruction is required"],
    },
  },
  {
    timestamps: true,
    autoCreate: true,
    // autoIndex: true,
  }
);
// taskSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const taskModel = model("task", taskSchema);
module.exports = taskModel;
