const express = require("express");
const roomController = require("../controllers/rooms");
const roomRouter = express.Router();

roomRouter.route("/:userId").post(roomController.createRoom);

roomRouter
	.route("/:userId/:roomId")
	.get(roomController.getRoomById)
	.put(roomController.updateRoomById)
	.delete(roomController.deleteRoomById);

module.exports = roomRouter;