const express = require("express");
const authRouter = require("./authRoutes");
const userRouter = require("./userRoutes");
const orderRouter = require("./orderRoutes");
const shopRouter = require("./shopRoutes");
const productRouter = require("./productRoutes");
const billingRouter = require("./billing");
const addressRouter = require("./address");
const roomRouter = require("./roomRoutes");
const transRouter = require("./transactions");
const activityRouter = require("./activitiesRoute")
const notificationsRouter = require("./notificationRoutes")

const passport = require("passport");


require("../services/authenticate");
module.exports = app = express();

app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/orders", passport.authenticate("jwt", { session: false }), orderRouter);
app.use("/shop", shopRouter);
app.use("/products", productRouter);
app.use("/address", passport.authenticate("jwt", { session: false }), addressRouter);
app.use("/billing", passport.authenticate("jwt", { session: false }), billingRouter);
app.use("/rooms", passport.authenticate("jwt", { session: false }), roomRouter);
app.use("/transactions", passport.authenticate("jwt", { session: false }), transRouter);
app.use("/activity", activityRouter);
app.use("/notifications", passport.authenticate("jwt", { session: false }), notificationsRouter);
