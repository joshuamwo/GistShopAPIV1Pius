const express = require("express");
var workerRouter = express.Router();

var workerModel = require("../models/workerSchema");


workerRouter
	.route(`/`)
	.get((req, res, next) => {
		workerModel
			.find({})
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
				(err) => next(err)
			)
			.catch((e) => next(e));
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
				(err) => next(err)
			)
			.catch((err) => next(err));
	})
	.put((req, res, next) => {
		workerModel
			.findByIdAndUpdate(
				req.params.workerId,
				{
					$set: req.body,
				},
				{ new: true }
			)
			.then(
				(worker) => {
					res.statusCode = 200;
					res.setHeader("Content-Type", "application/json");
					res.json(worker);
				},
				(err) => next(err)
			)
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		workerModel.findByIdAndDelete(req.params.workerId).then((worker) => {
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json");
			res.json(worker);
		});
	});

module.exports = workerRouter;
