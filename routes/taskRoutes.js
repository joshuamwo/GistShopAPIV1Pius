const express = require("express");
var taskRouter = express.Router();
var task = require("../models/taskSchema");

/*....................Add task............................*/
taskRouter.route(`/`).post((req, res, next) => {
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
          res.json(`task already exists`);
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

/*...........................get tasks by departmment.........................*/
taskRouter.route(`/departments/:department`).get((req, res, next) => {
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
});

/*...................get update and delete Task by id...............................*/
taskRouter
  .route("/:taskId")
  .get((req, res, next) => {
    task
      .findById(req.params.taskId)
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
  .put((req, res, next) => {
    let newTask = req.body;
    task
      .findByIdAndUpdate(
        req.params.taskId,
        {
          $set: newTask,
        },
        { new: true, runValidators: true }
      )
      .then(
        (object) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(object);
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
