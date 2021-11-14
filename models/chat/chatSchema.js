const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatsSchema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "conversations",
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "workers",
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: "workers",
    },
    body: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
  }
);

const Chat = mongoose.model("chat", chatsSchema);

module.exports = {
  ChatsModel: Chat,
};
