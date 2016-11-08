var express = require("express");
var path = require("path");
var app = express();
app.use(express.static(path.join(__dirname,"./static")));
app.set("views",path.join(__dirname,"./views"));
app.set("view engine", "ejs");
app.get("/",function(request,response){
	response.render("index");
})
var server = app.listen(8000,function(){
	console.log("listening to port 8000");

})
var io = require("socket.io").listen(server);
var usersGroup = {};
io.sockets.on("connection",function(socket){
	console.log("someone just join the group chat");
	socket.on("newUserLogin",function(dataFromSocket){
		usersGroup[socket.id]=dataFromSocket.name;
		console.log(socket.id,dataFromSocket.name);
		socket.broadcast.emit("newUserJoin",{"name":dataFromSocket.name});
		socket.emit("welcome");
	})
	socket.on("sendMessage",function(dataFromSocket){
		io.emit("updateMessage",{"user":usersGroup[socket.id],"message":dataFromSocket.message});
	})
})
