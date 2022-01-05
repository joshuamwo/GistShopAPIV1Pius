const express = require("express");
const path = require("path");
require("dotenv").config({ path: `${__dirname}/CONFIG/.env` });
require("./services/authenticate");
const connect = require("./services/dbConnect");


/*****************
 *SERVER INITILIZATIONS
 *****************/
const app = express();

/*****************
 *VIEW ENGINE CONFIG
 *****************/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

/*****************
 *MIDDLEWARE
 *****************/
app.use(require("./services/middleware"));
app.use(require("./Routes/ROUTE_MOUNTER"));

/*****************
 *SERVER INSTANTIATION
 *****************/
const port = process.env.PORT || 5000;
connect();
app.listen(port);

module.exports = app;
