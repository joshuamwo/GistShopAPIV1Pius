const express = require("express");
const authRouter = require("./authRoutes");
const userRouter = require("./userRoutes");
const orderRouter = require("./orderRoutes");
const shopRouter = require("./shopRoutes");


const passport = require("passport");

require("../services/authenticate");
module.exports = app = express();

app.use("/", authRouter);
app.use("/users", passport.authenticate("jwt", { session: false }), userRouter);
app.use("/orders", passport.authenticate("jwt", { session: false }), orderRouter);
app.use("/shop", passport.authenticate("jwt", { session: false }), shopRouter);