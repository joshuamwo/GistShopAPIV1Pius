const express = require('express')
const animalRouter = require("./animalRoutes");
const authRouter = require("./authRoutes");
const inventoryRouter = require("./inventoryRoutes");
const workerRouter = require("./workerRoutes");
const taskRouter = require("./taskRoutes");
const logRouter = require("./logRoutes");
const messageRouter = require("./chat/messageRoutes");
const conversationRouter = require("./chat/conversationRoutes");

const passport = require('passport');
const multer = require('multer');

require("../services/authenticate");
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


/*****************
  *configure morgan for form data  uploads
*****************/
const storage = multer.diskStorage({
  destination: (req,res,cb) => cb(null, "../public/images"),
  filename: (req, file,cb) => cb(null,req.body.name)
});

const upload = multer({storage});


/*****************
  *chat routes
*****************/
app.use("/conversations", conversationRouter);
app.use("/messages", messageRouter);
