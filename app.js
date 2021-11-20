const express = require("express");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const chatConfig = require("./Config/chatConfig");
const connect = require("./Services/dbConnect");
require("dotenv").config({ path: `${__dirname}/CONFIG/.env` });
require("./Services/authenticate");


const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer);
io.on("connection", (socket) => chatConfig(socket));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(require("./Services/middleware"));
app.use(require("./Routes/routeMouter"));


const port = process.env.PORT || 5000;
httpServer.listen(port);
connect();

module.exports = app;
