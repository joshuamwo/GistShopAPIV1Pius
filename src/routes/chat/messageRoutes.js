const router = require("express").Router();
const controller = require("../../Controllers/chat")


/*****************
    *write message
    *read message
*****************/

router.post("/", controller.writeMessage);

router.get("/:conversationId", controller.readMessage);

module.exports = router;