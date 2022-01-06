const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    conversationId: String,
    sender: String,
    text: String
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);

