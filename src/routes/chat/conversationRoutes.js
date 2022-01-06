const router = require("express").Router();
const chatController = require("../../Controllers/chat");

/*****************
 *post/start  new conversation
 *get all your chats
 *get a conversation from your list of chats
 *****************/

router.post("/", chatController.startNewConvo);

router.get("/:userId", chatController.getYourChats);

router.get("/find/:user1/:user2", chatController.getSpecificChat);

module.exports = router;