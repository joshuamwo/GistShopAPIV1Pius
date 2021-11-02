var workerModel = require("../models/workerSchema");


exports.getAllWorkers = (req, res, next) => {
    workerModel
      .find({})
      .sort("-_id")
      .then(
        (workers) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(workers);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  }

exports.getWorkerById=(req, res, next) => {
    workerModel
      .findById(req.params.workerId)
      .then(
        (worker) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(worker);
        },
        (err) => {
          res.statusCode = 422;
          res.setHeader("Content-Type", "application/json");
          res.json(err.errors);
        }
      )
      .catch((err) => {
        res.statusCode = 422;
        res.setHeader("Content-Type", "application/json");
        res.json(err.errors);
      });
  }

exports.addWorker = (req, res, next) => {
    workerModel
      .create(req.body)
      .then(
        (newWorker) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(newWorker);
        },
        (err) => {
          if (err.code === 11000) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.json(`${req.body.firstName} already exists`);
          } else {
            res.statusCode = 422;
            res.setHeader("Content-Type", "application/json");
            res.json(err.errors);
          }
        }
      )
      .catch((e) => {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json(err.errors);
      });
  }

exports.editWorkerById =(req, res, next) => {
    workerModel
      .findByIdAndUpdate(
        req.params.workerId,
        {
          $set: req.body,
        },
        { new: true, runValidators: true }
      )
      .then(
        (worker) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(worker);
        },
        (err) => {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.json(err.errors);
        }
      )
      .catch((err) => {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.json(err.errors);
      });
  }

exports.deleteWorkerById = (req, res, next) => {
  workerModel.findByIdAndDelete(req.params.workerId).then((worker) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(worker);
  });
};