var express = require("express");
var cors = require('cors');
var app = express();
app.use(cors());
//var port = process.env.PORT || 8080;
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

//console.log(port);
server.listen(8080, () => {
  console.log("listening *: 8080");
});
