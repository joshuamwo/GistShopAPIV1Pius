const express = require("express");
const logRouter = express.Router();

const logs = require("../models/logSchema");

logRouter.route(`/`).get((req, res, next) => {
  logs
    .find()
    .sort("-_id")
    .then(
      (logs) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(logs);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = logRouter;
