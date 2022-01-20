const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const workerModel = require("../models/workerSchema");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

require("dotenv").config({ path: ".env" });

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      workerModel
        .findOne({ email: email })
        .then(
          (worker) => {
            if (!worker)
              return done(null, false, { emailErr: "incorrect email address" });

            /*.................nested promise to verify  password....................... */
            worker
              .isValidPassword(password)
              .then(
                (validate) => {
                  if (validate)
                    done(null, validate, { department: worker.department });
                  else if (!validate)
                    done(null, false, { passErr: "Invalid password" });
                },
                (err) => done(null, false, { passErr: "incorrect password" })
              )
              .catch((err) =>
                done(null, false, { passErr: "Incorrect password" })
              );
            /*......................end of nested promise..............................*/
          },
          (err) => done(null, false, { message: err.message })
        )
        .catch((err) => done(null, false, { message: err.message }));
    }
  )
);

passport.use(
  "manager",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      workerModel
        .findOne({ email: email, title: "manager" })
        .then(
          (manager) => {
            if (!manager)
              return done(null, false, { message: "Incorrect email address" });
            /*nested promise to check if password is correct if email and title match */
            manager
              .isValidPassword(password)
              .then(
                (validate) => {
                  if (validate) done(null, validate, { message: "Sucessful" });
                  else if (!validate)
                    done(null, false, { message: "Invalid password" });
                },
                (err) => done(null, false, { message: "Incorrect password" })
              )
              .catch((err) =>
                done(null, false, { message: "Incorrect password" })
              );
            /* ...............................end of nested promise..................... */
          },
          (err) => done(null, false, { message: err.message })
        )
        .catch((err) => done(null, false, { message: err.message }));
    }
  )
);

passport.use(
  "jwt",
  new JWTStrategy(
    {
      secretOrKey: process.env.secret_key,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token, { message: "Success" });
      } catch (error) {
        done(error);
      }
    }
  )
);
