
var io = require('socket.io')();


var mySocket = {};

io.on('connection', function (socket) {
	console.log('Got one client');

	io.mySocket = socket;

	console.log("My Socket: "+ socket.id);

});

module.exports = io;