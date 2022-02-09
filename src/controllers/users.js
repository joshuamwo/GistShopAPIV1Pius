const userModel = require("../models/userSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: `${__dirname}/../../.env` });

exports.getAllUsers = (req, res, next) => {
	userModel
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
};

exports.getUserById = (req, res, next) => {
	userModel
		.findById(req.params.userId)
		.then(
			(user) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(user);
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
};

exports.addUser = (req, res) => {
	const newUser = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		department: req.body.department,
		title: req.body.title,
		email: req.body.email,
		password: req.body.password,
		profilePhoto: req.body.image,
	};

	userModel
		.create(newUser)
		.then(
			(newUser) => {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(newUser);
			},
			(err) => {
				res.status(422).setHeader("Content-Type", "application/json").json(err);
			}
		)
		.catch((e) => {
			res.statusCode = 401;
			res.setHeader("Content-Type", "application/json");
			res.json(err.errors);
		});
};

exports.editUserById = (req, res) => {
	userModel
		.findByIdAndUpdate(
			req.params.userId,
			{
				$set: req.body
			},
			{ new: true, runValidators: true }
		)
		.then(
			(user) => {
				const token = jwt.sign(user.email, process.env.secret_key);
				const { _id, firstName, lastName, email, userName, bio } = user;
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json({ token, _id, firstName, lastName, email, userName, bio });
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

exports.deleteUserById = (req, res, next) => {
	userModel.findByIdAndDelete(req.params.userId).then((user) => {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.json(user);
	});
};
