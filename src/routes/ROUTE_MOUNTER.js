const express = require("express");
const authRouter = require("./authRoutes");
const userRouter = require("./userRoutes");
const orderRouter = require("./orderRoutes");
const shopRouter = require("./shopRoutes");
const productRouter = require("./productRoutes");
const billingRouter = require("./billing");
const addressRouter = require("./address");
const roomRouter = require("./roomRoutes");

const passport = require("passport");


require("../services/authenticate");
module.exports = app = express();

app.use("/", authRouter);
app.use("/users", passport.authenticate("jwt", { session: false }), userRouter);
app.use("/orders", passport.authenticate("jwt", { session: false }), orderRouter);
app.use("/shop", passport.authenticate("jwt", { session: false }), shopRouter);
app.use("/products", passport.authenticate("jwt", { session: false }), productRouter);
app.use("/address", passport.authenticate("jwt", { session: false }), addressRouter);
app.use("/billing", passport.authenticate("jwt", { session: false }), billingRouter);
app.use("/rooms", passport.authenticate("jwt", { session: false }), roomRouter);