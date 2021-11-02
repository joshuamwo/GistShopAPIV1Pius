var task = require("../models/taskSchema");


exports.getTasks = (req, res, next) => {
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
};

exports.getTaskById = (req, res, next) => {
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
};

exports.editTask = (req, res, next) => {
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
};

exports.deleteTask = (req, res, next) => {
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
};



exports.postTask = (req, res, next) => {
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
};