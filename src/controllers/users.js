const userModel = require("../models/userSchema");

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
    profilePicture: {
      data: req?.file?.buffer,
      contentType: req?.file?.mimetype,
    },
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
        if (err.code === 11000) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.json(`${req.body.firstName} already exists`);
        } else {
          res.statusCode = 422;
          res.setHeader("Content-Type", "application/json");
          res.json(err.errors);
        }
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
        $set: req.body && req.files,
      },
      { new: true, runValidators: true }
    )
    .then(
      (user) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(user);
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
