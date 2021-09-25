const express = require("express");
var inventoryRouter = express.Router();

var inventory = require("../models/inventorySchema");
var logs = require("../models/logSchema");

inventoryRouter
  .route(`/`)
  .get((req, res, next) => {
    inventory
      .find()
      .sort("-_id")
      .then(
        (store) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(store);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    inventory
      .create(req.body)
      .then(
        (store) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(store);
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

inventoryRouter
  .route("/:objectId")
  .get((req, res, next) => {
    inventory
      .findById(req.params.objectId)
      .then(
        (item) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(item);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    let newObject = req.body;
    inventory
      .findByIdAndUpdate(req.params.objectId, { $set: newObject })
      .then(
        (object) => {
          var originalAmount = object.amount;
          const newLog = new logs({
            email: req.body.email,
            product: req.body.name,
            amount: req.body.amount - originalAmount,
          });
          /*Add new log document each time an update happens
          on the inventory*/
          logs
            .create(newLog)
            .then(
              (log) => {
                res.statusCode = 200;
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
          /*end of the nested promise*/

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(object);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .delete((req, res, next) => {
    inventory
      .findByIdAndDelete(req.params.objectId)
      .then(
        (object) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json("deleted succesfully");
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = inventoryRouter;
