const express = require("express");
var workerRouter = express.Router();

var workerModel = require("../models/workerSchema");

workerRouter
  .route(`/`)
  .get((req, res, next) => {
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
  })

  .post((req, res, next) => {
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
  });

workerRouter
  .route("/:workerId")
  .get((req, res, next) => {
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
  })
  .put((req, res, next) => {
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
          res.json(err.errors)
        }
      )
      .catch((err) =>  {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.json(err.errors);
      });
  })
  .delete((req, res, next) => {
    workerModel.findByIdAndDelete(req.params.workerId).then((worker) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(worker);
    });
  });

module.exports = workerRouter;
