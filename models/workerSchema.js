const mongoose = require('mongoose');
const { Schema, model } = mongoose;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const bcrypt = require('bcrypt');

const value = {
  type: String,
  required: true,
  trim: true,
  unique: false,
}

const workerSchema = new Schema({
  firstName: value,
  lastName: value,
  title: value,
  department: value,
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
    dropDups: true,
  },
  password: value,
  salary: {
    type: Currency,
    required: true,
  },
  date_employed: { type: Date, default: Date.now() },
},
  {
    timestamps: true,
    autoCreate: true, // auto create collection
    autoIndex: true, // auto create indexes
  });

/* a prehook that is called before the user info is stored in the database 
this hook will hash the plain text password befor storing it*/
workerSchema.pre('save', async function (next) {
  const worker = this;
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

workerSchema.methods.isValidPassword = async function(password) {
  const worker = this;
  const compare = await bcrypt.compare(password, worker.password);
  return compare;
}


const workers = model('worker', workerSchema);
module.exports = workers;