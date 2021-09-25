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
