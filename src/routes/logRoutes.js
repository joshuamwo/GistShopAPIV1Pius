const express = require("express");
const logRouter = express.Router();
const logController = require("../Controllers/logs");

logRouter.route(`/`).get(logController.getLogs);

module.exports = logRouter;
