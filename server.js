var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const User = require('./src/user.js')

const connectedUsers = {};
const sharedFiles = {};

app.use(express.static('resources'));
app.use(express.static('src'));
app.use(express.static('dist'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/empty', function(req, res){
  res.sendFile(__dirname + '/index2.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	connectedUsers[socket.id] = new User(socket.id);

	socket.on('disconnect', function(socket){
		console.log('a user disconnected');
	});

	socket.on('share.file', function(file) {
		console.log('sharing', file);
		sharedFiles[file.hash] = file.blob;
	});

	socket.on('request.file', function(hash) {
		socket.emit('response.file', {
			hash,
			buffer: sharedFiles[hash],

		})
	})
});

http.listen(3668, function(){
  console.log('listening on *:3668');
});