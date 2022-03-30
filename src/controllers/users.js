const userModel = require("../models/userSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: `${__dirname}/../../.env` });
const functions = require("../shared/functions")
const transactionModel = require("../models/transactionSchema");
const utils = require("../../utils");


const upgradeAmount = 200;

exports.getAllUsers = (req, res, next) => {
	
	userModel
		.find({})
		.populate("shopId", [
			'name','email','location','phoneNumber','image','description','open','ownerId'
		])
		.sort("-_id")
		.limit(20)
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
		.populate("shopId", [
					'name','email','location','phoneNumber','image','description','open','ownerId'
				])
		.then(
			(user) => {

				user.followersCount = user.followers.length
				user.followingCount = user.following.length
/*
				user.followers = []
				user.following = []
*/

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

exports.userFollowers = async function (req, res) {
	try {
  
	const users = await userModel.find({
		following: req.params.userId})
  
	  res.json(users);
	} catch (error) {
		console.log(error + " ")
	  res.status(404).send(error);
	}
  };

  exports.userFollowing = async function (req, res) {
	try {
  
	const users = await userModel.find({
		followers: req.params.userId})
  
	  res.json(users);
	} catch (error) {
		console.log(error + " ")
	  res.status(404).send(error);
	}
  };

exports.searchForUser = async function (req, res) {
	try {
  
	const users = await userModel.find({
	firstName: { $regex: req.params.name, $options: "i" }}).limit(20)
  
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
				const { _id, firstName, lastName, email, userName, bio, profilePhoto, phonenumber, wallet } = user;
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json({ user, token });
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
					async (user) => {

						let newTransaction = {
							to: req.params.userId,
							reason: utils.Transactionreasons.UPGRADE,
							amount: upgradeAmount,
							type: "upgrade",
							deducting: true,
							date: Date.now()
						};
						await transactionModel.create(newTransaction);

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
			toFollowUid,
			"New follower",
			'ProfileScreen',
			false,
			null,
			myUid,
			"You have a new follower",
			toFollowUid
		  )
		  
		  console.log(myUpdatedUser + " ")

		  res.statusCode = 200;
		  res.setHeader("Content-Type", "application/json");
		  myUpdatedUser['success'] = true;
		  res.json(myUpdatedUser);

	} catch (error) {

console.log(error + " ")
		res.statusCode = 400;
		res.setHeader("Content-Type", "application/json");
		res.json({"success": false});		
		
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