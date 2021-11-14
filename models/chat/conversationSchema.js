const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  id: { 
    type: String,
    required: true
  },


});

const conversation = model("conversation",ConversationSchema);

module.exports = conversation;