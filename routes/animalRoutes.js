const express = require("express");
var animalRouter = express.Router();

var beefModel = require("../models/beefSchema");
var dairyModel = require("../models/dairySchema");
var layerModel = require("../models/layerSchema");
var pigModel = require("../models/pigSchema");

const getModel = (department) => {
  if (department === "beefs") return beefModel;
  else if (department === "dairies") return dairyModel;
  else if (department === "layers") return layerModel;
  else if (department === "pigs") return pigModel;
  else return null;
};

animalRouter
  .route(`/:department`)
  .get((req, res, next) => {
    getModel(req.params.department)
      .find()
      .sort("-_id")
      .then(
        (animal) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(animal);
        },
        (err) => {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.json(err.errors);
        }
      )
      .catch((err) => {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.json(err.errors);
      });
  })

  .post((req, res, next) => {
    getModel(req.params.department)
      .create(req.body)
      .then(
        (animal) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(animal);
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
        res.statusCode = 422;
        res.setHeader("Content-Type", "application/json");
        // if (err.code===11000) res.json("This item already exists");
        res.json(err.errors);
      });
  });

animalRouter
  .route("/:department/:animalId")
  .get((req, res, next) => {
    getModel(req.params.department)
      .findById(req.params.animalId)
      .then(
        (animal) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(animal);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put((req, res, next) => {
    var updatedAnimal = req.body;
    getModel(req.params.department)
      .findByIdAndUpdate(
        req.params.animalId,
        {
          $set: updatedAnimal,
        },
        { new: true }
      )
      .then(
        (newAnimal) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(newAnimal);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .delete((req, res, next) => {
    getModel(req.params.department)
      .findByIdAndDelete(req.params.animalId)
      .then(
        (animal) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(animal);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = animalRouter;
