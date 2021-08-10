const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const workerModel = require('../models/workerSchema');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

require('dotenv').config({ path: `${__dirname}/.env` });

passport.use('login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const worker = await workerModel.findOne({ email });
    if (!worker) {
      return done(null, false, { message: "User not found" })
    }

    const validate = await worker.isValidPassword(password);
    if (!validate) {
      return done(null, false, { message: "Wrong password" })
    }
    return done(null, worker, { message: "Successful" })
  }
  catch (err) {
    return done(err);
  }
}
));

passport.use(new JWTStrategy({
  secretOrKey: process.env.secret_key,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
}, async (token, done) => {

  try {
    return done(null, token.user, { message: 'Success' })
  }
  catch (error) {
    done(error);
  }
}

));