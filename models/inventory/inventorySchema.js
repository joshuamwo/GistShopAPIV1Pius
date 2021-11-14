const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const inventorySchema = new Schema({
  name: {
    type: String,
    unique: [true, 'The name field should be unique'],
    required: [true, 'The name field is required'],
    dropDups: true,
  },
  amount: {
    type: Number,
    required: [true, 'The amount field is required'],
  },
  unit_weight: {
    type: Number,
    required: [true, 'The unit weight field is required'],
  },
  vendor: {
    type:String,
    required: [true, 'The vendor field is required'],
  },
  department: {
    type:String,
    required: [true, 'The department field is required'],
  },
}, {
  timestamps: true,
  autoIndex: true,
  autoCreate: true,
});

const inventory = model('inventory', inventorySchema);

module.exports = inventory;