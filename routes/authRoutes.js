const express = require("express");
const authRouter = express.Router();
const authController = require("../Controllers/auth");

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.userLogin);

authRouter.post("/admin/login", authController.adminLogin);

authRouter.post("/logout", authController.logout);

module.exports = authRouter;
