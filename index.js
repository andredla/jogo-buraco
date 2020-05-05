// Import the Express module
var express = require('express');

// Create a new instance of Express
var app = express();

// Import the Anagrammatix game file.
var bur = require('./buraco');

app.get("/", function(req, res){
	res.sendFile(__dirname + "/client/index.html");
});

app.use("/client", express.static(__dirname + "/client"));

// Create a Node.js based http server on port 8080
var server = require('http').createServer(app).listen(process.env.PORT || 2000);

console.log("server started...");

// Create a Socket.IO server and attach it to the http server
var io = require('socket.io').listen(server);

// Reduce the logging output of Socket.IO
//io.set('log level',1);

// Listen for Socket.IO Connections. Once connected, start the game logic.
io.sockets.on("connection", function (socket) {
	console.log('client connected...');
	bur.initGame(io, socket);
});