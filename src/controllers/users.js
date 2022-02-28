const userModel = require("../models/userSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: `${__dirname}/../../.env` });
const functions = require("../shared/functions")

const upgradeAmount = 200;

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
		.populate("following", [
			"_id",
			"firstName",
			"lastName",
			"userName",
			"profilePhoto",
			"followers"
		])
		.populate("followers",
		[
			"_id",
			"firstName",
			"lastName",
			"userName",
			"profilePhoto",
			"followers"
		])
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


exports.searchForUser = async function (req, res) {
	try {
  
	const users = await userModel.find({
	firstName: { $regex: req.params.name, $options: "i" }})
	.populate("following", [
			"_id"
		])
	.populate("followers",
		[
			"_id"
		])
  
	  res.json(users);
	} catch (error) {
	  res.status(404).send(error);
	}
  };

exports.addUser = (req, res) => {
	const newUser = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		department: req.body.department,
		title: req.body.title,
		email: req.body.email,
		password: req.body.password,
		profilePhoto: req.body.profilePhoto,
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
	console.log(req.body)
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
				console.log(user)
				const token = jwt.sign(user.email, process.env.secret_key);
				const { _id, firstName, lastName, email, userName, bio, profilePhoto } = user;
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json({ token, _id, firstName, lastName, email, userName, bio, profilePhoto });
			},
			(err) => {
				console.log(err)
				res.statusCode = 400;
				res.setHeader("Content-Type", "application/json");
				res.json(err.errors);
			}
		)
		.catch((err) => {
			console.log(err)
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

exports.upgradeAccount = async (req, res) => {

	try {
		let user = await userModel
			.findById(req.params.userId)

		if (user.wallet > upgradeAmount) {

			let updateBody = {
				wallet: (user.wallet - upgradeAmount),
				memberShip: 1,
				upgradedDate: Date.now()
			}


			await userModel
				.findByIdAndUpdate(
					req.params.userId,
					{
						$set: updateBody,
					}
					
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
						console.log(err)
						res.statusCode = 400;
						res.setHeader("Content-Type", "application/json");
						res.json(err.errors);
					}
				)
				.catch((err) => {
					console.log(err)
					res.statusCode = 400;
					res.setHeader("Content-Type", "application/json");
					res.json(err.errors);
				})

		}else{
			res.statusCode = 400;
					res.setHeader("Content-Type", "application/json");
					res.json("You do not have enough coins");
		}

	} catch (error) {
		console.log(error)
		res.statusCode = 400;
		res.setHeader("Content-Type", "application/json");
		res.json(error);
	}
};

exports.followUser = async (req, res) => {
	try {

		let myUid = req.params.myUid
		let toFollowUid = req.params.toFollowUid


		await userModel.findByIdAndUpdate(
			toFollowUid,
			{
			  $addToSet: {followers: myUid},
			  
			},
			{ runValidators: true, new: true, upsert: false }
		  );
		
		let myUpdatedUser = await userModel.findByIdAndUpdate(
			myUid,
			{
			  $addToSet: {following: toFollowUid},
			  
			},
			{ runValidators: true, new: true, upsert: false }
		  );

		  functions.saveActivity(
			orderId,
			"New follower",
			'ProfileScreen',
			false,
			null,
			myUid,
			"You have a new follower",
			toFollowUid
		  )

		  res.statusCode = 200;
		  res.setHeader("Content-Type", "application/json");
		  res.json(myUpdatedUser);

	} catch (error) {

		res.statusCode = 400;
		res.setHeader("Content-Type", "application/json");
		res.json(error);		
		
	}
}

exports.unFollowUser = async (req, res) => {
	try {

		let myUid = req.params.myUid
		let toFollowUid = req.params.toFollowUid


		await userModel.findByIdAndUpdate(
			toFollowUid,
			{
			  $pullAll: {followers: [myUid]},
			  
			},
			{ runValidators: true, new: true, upsert: false }
		  );
		
		let myUpdatedUser = await userModel.findByIdAndUpdate(
			myUid,
			{
			  $pullAll: {following: [toFollowUid]},
			  
			},
			{ runValidators: true, new: true, upsert: false }
		  );

		  res.statusCode = 200;
		  res.setHeader("Content-Type", "application/json");
		  res.json(myUpdatedUser);

	} catch (error) {

		console.log(error)
		res.statusCode = 400;
		res.setHeader("Content-Type", "application/json");
		res.json(error);		
		
	}
}