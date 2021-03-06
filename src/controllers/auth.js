const userModel = require("../models/userSchema");
const passport = require("passport");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: `${__dirname}/../../.env` });

var messagebird = require("messagebird")(process.env.MESSAGEBIRDKEY);
var params = {
  originator: "GistHouse",
  template: "Your GistShop verification code is: %token",
  timeout: 150,
};

exports.register = async (req, res, next) => {
  const newWorker = new userModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    bio: req.body.bio,
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    phonenumber: req.body.phonenumber,
    profilePhoto: req.body.profilePhoto,
  });

  try {
    let added = await userModel.create(newWorker);
    const token = jwt.sign(req.body.email, process.env.secret_key);
    const { _id, firstName, lastName, email, userName, bio, profilePhoto,phonenumber } =
      added;
    res.status(200).setHeader("Content-Type", "application/json").json({
			token,
			_id,
			firstName,
			lastName,
			email,
			userName,
			bio,
         phonenumber
		});
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
        const { _id, firstName, lastName, email, userName, bio, phonenumber } =
          info;
        res.json({
          token,
          _id,
          firstName,
          lastName,
          email,
          userName,
          bio,
          phonenumber,
        });
      }
    });
  })(req, res, next);
};

exports.phoneLogin = (req, res, next) => {
  /* custom callback . gives us access to req res and next coz of js closure */
  try {
    messagebird.verify.create(req.body.phone, params, function (err, response) {
      if (err) {
        return console.log(err);
      }
      res.status(200).json({ status: 200, requestid: response.id });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.verifyCode = (req, res, next) => {
  try {
    if (!req.body.requestId || !req.body.code) {
      res.status(400).json({ status: 400, message: "Missing required params" });
    } else {
      let requestId = req.body.requestId;
      messagebird.verify.verify(
        requestId,
        req.body.code,
        async function (err, response) {
          if (err) {
            res.status(400).json({ status: 400, message: err });
          } else {
            if (response.status == "verified") {
              const user = await userModel.findOne({
                phonenumber: { $eq: req.body.phone },
              });
              if (!user) {
                res.status(400).json({ status: 400, user: null });
                return;
              }

              const token = jwt.sign(user.phonenumber, process.env.secret_key);
              res.status(200).json({ user, token });
            } else {
              res
                .status(400)
                .json({ status: 400, message: "something happened" });
            }
          }
        }
      );
    }
  } catch (error) {
    res.status(400).json({ status: 400, message: error });
  }
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
