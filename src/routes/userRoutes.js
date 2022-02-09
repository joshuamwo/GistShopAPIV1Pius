const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/users");

const passport = require("passport");

require("../services/authenticate");

const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
	allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

let upload = multer({ storage, fileFilter });

userRouter
	.route(`/`)
	.get(
		passport.authenticate("jwt", { session: false }),
		userController.getAllUsers
	)
	.post(upload.single("profilePicture"), userController.addUser);

userRouter
	.route("/:userId")
	.get(
		passport.authenticate("jwt", { session: false }),
		userController.getUserById
	)
	.put(
		passport.authenticate("jwt", { session: false }),
		userController.editUserById
	)
	.delete(
		passport.authenticate("jwt", { session: false }),
		userController.deleteUserById
	);

module.exports = userRouter;
