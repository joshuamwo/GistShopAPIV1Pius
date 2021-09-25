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
    weekly_weight: {
      type: [
        {
          date: {
            type: Date,
            required: [true, "Date field is required"],
          },
          weight: {
            type: Number,
            required: [true, "Weight field is required"],
          },
        },
      ],
    },
    breed: {
      type: String,
      required: [true, " Breed is required"],
    },
    eggs_weekly: {
      type: [
        {
          date: {
            type: Date,
            required: [true, "Date field is required"],
          },
          number: {
            type: Number,
            required: [true, "Number field is required"],
          },
        },
      ],
    },
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
