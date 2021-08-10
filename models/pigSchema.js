const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const pigSchema = new Schema({
  name: {
    type: String, required: true, unique: true
  },
  age_in_weeks: {
    type: Number, required: true
  },
  weekly_weight: {
    type: [{
      date: Date, weight: Number
    }], required: true
  },
  sex: {
    type: String, required: true
  },
  breed: {
    type: String, required: true
  },
  department: {
    type: String, required: true
  },
  history: [String],
}, {
  timestamps: true,
  autoCreate: true,
  autoIndex: true
});


const pigs = model('pig', pigSchema);

module.exports = pigs;