const userModel = require("../models/userSchema");
const passport = require("passport");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: `${__dirname}/../../.env` });

exports.register = async (req, res, next) => {
	const newWorker = new userModel({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		bio: req.body.bio,
		userName: req.body.userName,
		email: req.body.email,
		password: req.body.password,
	});

	try {
		await userModel.create(newWorker);
		const email = req.body.email;
		const token = jwt.sign({ email }, process.env.secret_key);
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json({token});
	} catch (error) {
		res.status(422).setHeader("Content-Type", "application/json");
		if (error.code === 11000) res.json("This user already exists");
		else {
			const { errors } = error;
			res.json(errors);
		}
	}
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
				const email = req.body.email;
				const token = jwt.sign({ email }, process.env.secret_key);
				res.json({ token, email});
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
