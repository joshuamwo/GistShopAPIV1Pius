const express = require("express");
const path = require("path");
require("./src/services/authenticate");
const connect = require("./src/services/dbConnect");
const http = require("http");

/*****************
 *SERVER INITILIZATIONS
 *****************/
const app = express();

app.set("port", process.env.PORT || 5000);
/*****************
 *VIEW ENGINE CONFIG
 *****************/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

/*****************
 *MIDDLEWARE
 *****************/
app.use(require("./src/services/middleware"));
app.use(require("./src/routes/ROUTE_MOUNTER"));
app.use("/public/img", express.static(path.join(__dirname, "public/img")));

/*****************
 *SERVER INSTANTIATION
 *****************/
var server = http.createServer(app);
server.listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});
connect();

module.exports = app;
