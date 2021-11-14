const express = require("express");
var authRouter = express.Router();
var authController = require("../CONTROLLERS/auth");

authRouter.post("/register", authController.register);

authRouter.post("/login", authController.userLogin);

authRouter.post("/admin/login", authController.adminLogin);

authRouter.get("/logout", authController.logout);

module.exports = authRouter;
