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
    weekly_weight: {
      type: [
        {
          date: {
            type: Date,
            default: Date.now(),
            unique: true,
            required: [true, "Date field is required"],
          },
          weight: {
            type: Number,
            required: [true, "Weight field is required"],
          },
        },
      ],
    },
    milk_daily: {
      type: [
        {
          date: {
            type: Date,
            default: Date.now(),
            required: [true, "Date field is required"],
          },
          litres: {
            type: Number,
            required: [true, "Litres field is required"],
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

const breed = [
  "fresian",
  "ayrshire",
  "guernsey",
  "brown Swiss",
  "holstein",
  "jeysey",
];
const history = [
  "foot rot",
  "foot and mouth",
  "mastitis",
  "liver fluke",
  "grass tetany",
];

const dairy = model("dairy", dairySchema);

module.exports = dairy;
