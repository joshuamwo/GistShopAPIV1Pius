const userModel = require("../models/userSchema");
const passport = require("passport");
const jwt = require("jsonwebtoken");


var admin = require("firebase-admin");

const serviceAccount = require("../../service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

admin.firestore().settings({ ignoreUndefinedProperties: true });


require("dotenv").config({ path: `${__dirname}/../../.env` });

var messagebird = require("messagebird")(process.env.MESSAGEBIRDKEY);
var params = {
  originator: "GistHouse",
  template: "Your GistShop verification code is: %token",
  timeout: 150,
};

exports.register = async (req, res, next) => {
  try {
    const newWorker = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.bio,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      profilePhoto: req.body.profilePhoto,
    };

    let added  = await userModel.create(newWorker);
			
    const token = jwt.sign(added.email, process.env.secret_key);
    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .json({ user: added, token });
  } catch (error) {
    console.log(error);
    res
      .status(422)
      .setHeader("Content-Type", "application/json")
      .json({ status: 400, message: "email/phone number already exists" });
  }
};


exports.registerv1 = async (req, res, next) => {
  try {
    let newWorker = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    };

    let added = await userModel.create(newWorker);
 //   const token = jwt.sign(added.email, process.env.secret_key);
    
    
    admin.auth()
	      .createCustomToken(added._id.toString())
	      .then((customToken) => {
	        // Send token back to client
			const token = jwt.sign(added.email, process.env.secret_key);
	        res.status(200).json({authtoken: customToken,success:true, data:added,accessToken: token});
	
	      })
	      .catch((error) => {
	        console.log('Error creating custom token:', error);
	        res.status(400).json(null);
	      });

  } catch (error) {
    console.log(error);
    res
      .status(422)
      .setHeader("Content-Type", "application/json")
      .json({success:false, info:{message: "email already exists"} });
  }
};


exports.authenticate = (req, res, next) => {
	  /* custom callback . gives us access to req res and next coz of js closure */
  passport.authenticate("login", (err, user, info) => {
    if (err || !user) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({success:false,info});
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        return res
          .status(422)
          .setHeader("Content-Type", "application/json")
          .json(error.message);
      } else if (user && !error) {

	      admin.auth()
	      .createCustomToken(info._id.toString())
	      .then((customToken) => {
	        // Send token back to client
	        const token = jwt.sign(info.email, process.env.secret_key);
	        res.status(200).json({authtoken: customToken,success:true, data:info,accessToken: token});
	
	      })
	      .catch((error) => {
	        console.log('Error creating custom token:', error);
	        res.status(400).json(null);
	      });

      }
    });
  })(req, res, next);  
}

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
        const { _id, firstName, lastName, email, userName, bio, phonenumber, wallet } =
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
          wallet
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
