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
var users = [];

io.on('connection', function(socket) {

    // when the client emits 'add user', this listens and executes
    socket.on('add user', function(user) {
        // we store the username in the socket session for this client
        user.id = numUsers;
        socket.user = user;
        users.push(user);
        ++numUsers;
        io.sockets.emit('draw tank', user);
    });

    socket.on('reload map', function(data) {
        users[users.indexOf(socket.user)] = data.user;
        io.sockets.emit('draw map', data);
    });

    // when a user disconnect
    socket.on('disconnect', function () {
        users.splice(users.indexOf(socket.user), 1);
        io.sockets.emit('logout', socket.user);
    });
});
