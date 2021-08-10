const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const dairySchema = new Schema({
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
  milk_daily: {
    type: [{date: Date, litres: Number}],
    required: true
  },
  breed: {
    type: String, required: true
  },
  department: {
    type:String, required: true
  },
  history: [String],
},
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true
  });

const breed = ['fresian', 'ayrshire', 'guernsey', 'brown Swiss', 'holstein', 'jeysey'];
const history = ['foot rot', 'foot and mouth', 'mastitis', 'liver fluke', 'grass tetany'];

const dairy = model('dairy', dairySchema);

module.exports = dairy;