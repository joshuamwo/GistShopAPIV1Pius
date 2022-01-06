const router = require("express").Router();
const controller = require("../../controllers/chat")


/*****************
    *write message
    *read message
*****************/

router.post("/", controller.writeMessage);

router.get("/:conversationId", controller.readMessage);

module.exports = router;