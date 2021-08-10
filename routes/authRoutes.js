const express = require('express');
var workers = require('../models/workerSchema');
var authRouter = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken')

var seed = require('../config/seed');

require('dotenv').config({ path: `${__dirname}../config/.env` });

authRouter.post('/register', (req, res, next) => {
  var newWorker = new workers({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    department: req.body.department,
    title: req.body.title,
    salary: req.body.salary,
  });

  workers.create(newWorker)
    .then(worker => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(worker);
    }, err => next(err))
    .catch(err => next(err))
});

authRouter.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error('Houston we have a problem');
        return next(error);
      }
      req.login(user, { session: false }, (error) => {
        if (error) return next(error);
        // seed();
        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, process.env.secret_key);
        res.json({ token });
      })
    }
    catch (error) {
      return next(error);
    }
  })(req, res, next);
});


authRouter.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/auth/login');
  }
  else {
    err = new Error('You aren\'t logged in');
    err.status = 403;
    next(err);
  }
});

module.exports = authRouter;