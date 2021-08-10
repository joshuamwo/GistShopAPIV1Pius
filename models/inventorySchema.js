const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const inventorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    dropDups: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  unit_weight: {
    type: Number,
    required: true,
  },
  vendor: {
    type:String,
    required: true,
  },
  department: {
    type:String,
    required: true,
  },
}, {
  timestamps: true,
  autoIndex: true,
  autoCreate: true,
});

const inventory = model('inventory', inventorySchema);

module.exports = inventory;