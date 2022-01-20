const workers = require("../models/workerSchema");
const passport = require("passport");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: `${__dirname}/../../.env` });

exports.register = (req, res, next) => {
	const newWorker = new workers({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
		department: req.body.department,
		title: req.body.title,
		profilePicture: req.body.profilePicture,
	});

	workers
		.create(newWorker)
		.then(
			(worker) => {
				const email = req.body.email;
				const department = req.body.department;
				const token = jwt.sign({ email }, process.env.secret_key);
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json({ token, email, department });
			},
			(err) => next(err.errors)
		)
		.catch((err) => next(err.errors));
};

exports.userLogin = (req, res, next) => {
	/* custom callback . gives us access to req res and next coz of js closure */
	passport.authenticate("login", (err, user, info) => {
		if (err || !user) {
			res.statusCode = 401;
			res.setHeader("Content-Type", "application/json");
			res.json(info);
		}

		req.login(user, { session: false }, (error) => {
			if (error) {
				return res
					.status(422)
					.setHeader("Content-Type", "application/json")
					.json(error.message);
			} else if (user && !error) {
				let department = info.department;
				const email = req.body.email;
				const token = jwt.sign({ email }, process.env.secret_key);
				res.json({ token, email, department });
			}
		});
	})(req, res, next);
};

exports.adminLogin = (req, res, next) => {
	/*custom callback */
	passport.authenticate("manager", (err, user, info) => {
		if (err || !user) {
			res.statusCode = 401;
			res.setHeader("Content-Type", "application/json");
			res.json(info.message);
		}

		req.logIn(user, { session: false }, (error) => {
			seed();
			if (error) {
				return res
					.status(422)
					.setHeader("Content-Type", "application/json")
					.json(error.message);
			} else if (user && !error) {
				const email = req.body.email;
				const token = jwt.sign({ email }, process.env.secret_key);
				res.json({ token, email });
			}
		});
	})(req, res, next);
};

exports.logout = (req, res) => {
	if (req.session) {
		req.session.destroy();
		res.clearCookie("session-id");
		res.redirect("/auth/login");
	} else {
		err = new Error("You aren't logged in");
		err.status = 403;
		next(err);
	}
};
