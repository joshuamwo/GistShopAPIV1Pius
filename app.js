const express = require("express");
const path = require("path");
const connect = require("./Services/dbConnect");
require("dotenv").config({ path: `${__dirname}/CONFIG/.env` });
require("./Services/authenticate");

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
app.use(require("./Services/middleware"));
app.use(require("./Routes/ROUTE_MOUNTER"));

/*****************
  *SERVER INSTANTIATION
*****************/
const port = process.env.PORT || 5000;
connect();
app.listen(port);


module.exports = app;
