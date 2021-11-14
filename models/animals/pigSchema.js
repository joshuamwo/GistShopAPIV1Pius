const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const pigSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    age_in_weeks: {
      type: Number,
      required: [true, "Age in weeks is required"],
    },
    breed: {
      type: String,
      required: [true, " Breed is required"],
    },
    history: String,
    weekly_weight: [
      {
        date: {
          type: Date,
          default: Date.now()
        },
        weight: {
          type: Number,
          required: [true, "Weight field is required"],
        },
      },
    ],
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);

const pigs = model("pig", pigSchema);

module.exports = pigs;
