const express = require("express");
const roomController = require("../controllers/rooms");
const roomRouter = express.Router();

const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
	allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

let upload = multer({ storage, fileFilter });

roomRouter.route("/").get(roomController.getRoomsAllRooms);
roomRouter.route("/recent").get(roomController.getRecentRooms);

roomRouter
	.route("/:userId")
	.post(upload.any("productImages"), roomController.createRoom);

roomRouter
	.route("/rooms/:roomId")
	.get(roomController.getRoomById)
	.put(upload.any("productImages"), roomController.updateRoomById)
	.delete(roomController.deleteRoomById);

roomRouter.route("/get/all/:userId").get(roomController.getRoomsByUserId);

roomRouter.route("/get/all/shops/:shopId").get(roomController.getRoomsByShopId);

module.exports = roomRouter;
