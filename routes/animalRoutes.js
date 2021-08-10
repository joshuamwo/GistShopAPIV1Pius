const express = require("express");
var cors = require("cors");
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

const app = express();
app.use(cors({ credentials: true, origin: true }));
animalRouter
	.route(`/:department`)
	.get((req, res, next) => {
		getModel(req.params.department)
			.find()
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

	.post((req, res, next) => {
		getModel(req.params.department)
			.create(req.body)
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
