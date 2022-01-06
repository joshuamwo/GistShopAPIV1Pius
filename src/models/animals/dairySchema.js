const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const dairySchema = new Schema(
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
    weekly_weight: [
      {
        date: {
          type: Date,
          default: Date.now(),
        },
        weight: {
          type: Number,
          min: [200, "Minimum weight for a cow is 200 kilos"],
          max: [2500, "Maximum weight for a cow is 2500 kilos"],
          required: [true, "Weight field is required"],
        },
      },
    ],
    milk_daily: [
      {
        date: {
          type: Date,
          default: Date.now(),
        },
        litres: {
          type: Number,
          min: [0, "Minimum daily milk yield is 0 litres"],
          max: [75, "Maximum daily milk yield is 75 litres"],
          required: [true, "Litres field is required"],
        },
      },
    ],
    breed: {
      type: String,
      required: [true, " Breed is required"],
    },
    history: String,
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);

const dairy = model("dairy", dairySchema);

module.exports = dairy;
