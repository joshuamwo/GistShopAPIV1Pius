const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/auth");

const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
	const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
	allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

let upload = multer({ storage, fileFilter });

authRouter.post(
	"/register",
	upload.single("profilePicture"),
	authController.register
);

authRouter.post("/login", authController.userLogin);


authRouter.post("/logout", authController.logout);

module.exports = authRouter;
