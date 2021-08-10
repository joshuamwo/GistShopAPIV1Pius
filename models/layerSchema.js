const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const layerSchema = new Schema({
  name: {
    type: String, required: true, unique: true
  },
  age_in_weeks: {
    type: Number, required: true
  },
  monthly_weight: {
    type: [{
      date: Date, weight: Number
    }], required: true
  },
  breed: {
    type: String, required: true
  },
  eggs_weekly: {
    type: [{date: Date, number: Number}],
  },
  history: [String],
}, {
  timestamps: true,
  autoCreate: true,
  autoIndex: true
});


const layers = model('layer', layerSchema);

module.exports = layers;