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
		let added = await userModel.create(newWorker);
		const token = jwt.sign(req.body.email, process.env.secret_key);
      const { _id, firstName, lastName, email, userName, bio } = added;
		res
			.status(200)
			.setHeader("Content-Type", "application/json")
			.json({ token, _id, firstName, lastName, email, userName, bio });
	} catch (error) {
		res.status(422).setHeader("Content-Type", "application/json").json(error);
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
				const token = jwt.sign(req.body.email, process.env.secret_key);
				const { _id, firstName, lastName, email, userName, bio } = info;
				res.json({ token, _id, firstName, lastName, email, userName, bio });
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
