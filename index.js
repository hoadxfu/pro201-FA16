var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function() {
    console.log('Server listening at port %d', port);
});

// Routingjs
app.use(express.static(__dirname + '/public'));

var numUsers = 0;

io.on('connection', function(socket) {

    // when the client emits 'add user', this listens and executes
    socket.on('add user', function(data) {
        // we store the username in the socket session for this client
        socket.username = data.username;
        socket.usercolor = data.usercolor;
        socket.userXPos = data.userXPos;
        socket.userYPos = data.userYPos;
        ++numUsers;
        io.sockets.emit('draw tank', {
            username: data.username,
            usercolor: data.usercolor,
            userXPos: data.userXPos,
            userYPos: data.userYPos
        });
    });

    // when a user disconnect
    socket.on('disconnect', function () {
        io.sockets.emit('logout', {
            username: socket.username,
            usercolor: socket.usercolor,
            userXPos: socket.userXPos,
            userYPos: socket.userYPos
        });
    });
});
