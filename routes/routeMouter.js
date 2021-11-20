const express = require('express')
const animalRouter = require("./animalRoutes");
const authRouter = require("./authRoutes");
const inventoryRouter = require("./inventoryRoutes");
const workerRouter = require("./workerRoutes");
const taskRouter = require("./taskRoutes");
const logRouter = require("./logRoutes");
const passport = require('passport');

require("../Services/authenticate");
module.exports = app = express();

app.use("/", authRouter);
app.use(
  "/animals",
  passport.authenticate("jwt", { session: false }),
  animalRouter
);
app.use(
  "/inventory",
  passport.authenticate("jwt", { session: false }),
  inventoryRouter
);
app.use(
  "/workers",
  passport.authenticate("jwt", { session: false }),
  workerRouter
);
app.use("/tasks", passport.authenticate("jwt", { session: false }), taskRouter);
app.use("/logs", passport.authenticate("jwt", { session: false }), logRouter);