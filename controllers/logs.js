const logs = require("../models/logSchema");

exports.getLogs = (req, res, next) => {
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
};