const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/users");


const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
	allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

let upload = multer({ storage, fileFilter });

userRouter
	.route(`/`)
	.get(userController.getAllUsers)
	.post(upload.single("profilePicture"), userController.addUser);

userRouter
	.route("/:userId")
	.get(userController.getUserById)
	.put(upload.single("profilePicture"), userController.editUserById)
	.delete(userController.deleteUserById)


module.exports = userRouter;
