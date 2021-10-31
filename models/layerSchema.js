const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const layerSchema = new Schema(
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
          min: [1.5, "Minimum weight for a layer is 1.5 kilos"],
          max: [5, "Maximum weight for a layer is 5 kilos"],
          required: [true, "Weight field is required"],
        },
      },
    ],
    breed: {
      type: String,
      required: [true, " Breed is required"],
    },
    eggs_weekly: [
      {
        date: {
          type: Date,
          default: Date.now(),
        },
        number: {
          type: Number,
          min: [0, "Minimum egg count is 0 kilos"],
          max: [10, "Maximum egg count is 10"],
          required: [true, "Eggs field is required"],
        },
      },
    ],
    history: String,
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);

const layers = model("layer", layerSchema);

module.exports = layers;
