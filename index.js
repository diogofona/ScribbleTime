var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var ManageSocketIO = require("./socketIO/ManageSocketIO");

app.use(express.static(__dirname + "/public"));
app.use("/socketIO", express.static("./socketIO/"));
app.use("/enum", express.static("./enum/"));
app.use("/css", express.static("./css/"));
app.use("/canvas", express.static("./canvas/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

var manageSocket = new ManageSocketIO(io);

server.listen(8081, () => {
  console.log("listening *: 8081");
});
