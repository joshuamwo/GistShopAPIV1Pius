const Conversation = require("../Models/chat/conversationSchema");
const Message = require("../Models/chat/messageSchema");

/*****************
 *post/start  new conversation
 *get a conversation of a specific user
 *get a conversation involving 2 users

  *MESSAGES CONTROLLERS
  *write message
  *read message
 *****************/

exports.startNewConvo = async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getYourChats = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getSpecificChat = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.user1, req.params.user2] },
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

/*****************
 *MESSAGES CONTROLLER
 *****************/
exports.writeMessage = async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMsg = newMessage.save();
    res.status(200).json(savedMsg);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.readMessage = async (req,res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversation
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
}
