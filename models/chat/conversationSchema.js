const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema(
  {
    members: Array,
  },
  { timestamps: true }
);

const conversation = mongoose.model("conversation", ConversationSchema);

module.exports = conversation;
