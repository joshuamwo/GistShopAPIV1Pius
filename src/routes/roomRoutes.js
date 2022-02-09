const express = require("express");
const roomController = require("../controllers/rooms");
const roomRouter = express.Router();

roomRouter.route("/").get(roomController.getRoomsAllRooms);

roomRouter.route("/:userId").post(roomController.createRoom);

roomRouter
	.route("/rooms/:roomId")
	.get(roomController.getRoomById)
	.put(roomController.updateRoomById)
	.delete(roomController.deleteRoomById);

roomRouter.route("/get/all/:userId").get(roomController.getRoomsByUserId);

roomRouter.route("/get/all/shops/:shopId").get(roomController.getRoomsByShopId);

module.exports = roomRouter;
