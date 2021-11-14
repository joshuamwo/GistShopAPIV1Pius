const express = require("express");
const logRouter = express.Router();
var logController = require("../CONTROLLERS/logs");

logRouter.route(`/`).get(logController.getLogs);

module.exports = logRouter;
