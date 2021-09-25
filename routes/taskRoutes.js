const express = require("express");
var taskRouter = express.Router();
var task = require("../models/taskSchema");

taskRouter
  .route(`/:department`)
  .get((req, res, next) => {
    task
      .find({ department: req.params.department })
      .sort("-_id")
      .then(
        (task) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(task);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    task
      .create(req.body)
      .then(
        (task) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(task);
        },
        (err) => {
          if (err.code === 11000) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.json(`${req.body.name} already exists`);
          } else {
            res.statusCode = 422;
            res.setHeader("Content-Type", "application/json");
            res.json(err.errors);
          }
        }
      )
      .catch((err) => {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json(err.errors);
      });
  });

taskRouter
  .route("/:taskId")
  .put((req, res, next) => {
    let newTask = req.body;
    task
      .findByIdAndUpdate(
        req.params.taskId,
        {
          $set: newTask,
        },
        { new: true }
      )
      .then(
        (object) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(object);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .delete((req, res, next) => {
    task
      .findByIdAndDelete(req.params.taskId)
      .then(
        (task) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(task);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = taskRouter;
