const express = require("express");
const passport = require("passport");
var cors = require("cors");
var inventoryRouter = express.Router();

var inventory = require("../models/inventorySchema");
var logs = require("../models/logSchema");
const { log } = require("debug");

const app = express();
app.use(cors({ credentials: true, origin: true }));
inventoryRouter
  .route(`/`)
  .get((req, res, next) => {
    inventory
      .find()
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
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

inventoryRouter
  .route("/:objectId")
  .put((req, res, next) => {
 
    let newObject = req.body;
    inventory
      .findByIdAndUpdate( req.params.objectId, { $set: newObject })
      .then(
        (object) => {
          var originalAmount = object.amount; 
          const newLog = new logs({
            email: req.user.email,
            name: req.body.name,
            amount: originalAmount - req.body.amount
          });
          /*Add new log document each time an update happens
          on the inventory*/
          logs.create(newLog)
            .then(log => {
              res.statusCode = 200;
            }, err => next(err))
            .catch(err => next(err))
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
