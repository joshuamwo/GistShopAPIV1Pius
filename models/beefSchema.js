const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const beefSchema = new Schema({
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
  breed: {
    type: String, required: true
  },
  history: [String],
}, {
  timestamps: true,
  autoCreate: true,
  autoIndex: true
});


const beef = model('beef', beefSchema);

module.exports = beef;