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
		upload.single("profilePhoto"),
		userController.editUserById
	)
	.delete(
		passport.authenticate("jwt", { session: false }),
		userController.deleteUserById
	);

userRouter
	.route("search/:name")
	.get(
		passport.authenticate("jwt", { session: false }),
		userController.searchForUser
	)

userRouter
	.route("/upgrade/:userId")
	.put(
		passport.authenticate("jwt", { session: false }),
		userController.upgradeAccount
	)

userRouter
	.route("/follow/:myUid/:toFollowUid")
	.put(
		passport.authenticate("jwt", { session: false }),
		userController.followUser
	)


userRouter
	.route("/unfollow/:myUid/:toFollowUid")
	.put(
		passport.authenticate("jwt", { session: false }),
		userController.unFollowUser
	)

module.exports = userRouter;
