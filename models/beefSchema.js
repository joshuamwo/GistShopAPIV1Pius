const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const beefSchema = new Schema(
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
          min: [200, "Minimum weight for a bull is 200 kilos"],
          max: [2500, "Maximum weight for a bull is 2500 kilos"],
          required: [true, "Weight field is required"],
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

const beef = model("beef", beefSchema);

module.exports = beef;
