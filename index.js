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

var numTanks = 0;

io.on('connection', function(socket) {

    // when the client emits 'add tank', this listens and executes
    socket.on('add tank', function(tank) {
        // we store the tankname in the socket session for this client
        socket.tank = tank;
        ++numTanks;
        socket.emit('draw tank', tank);
    });

    socket.on('reload map', function(data) {
        data = JSON.parse(data);
        socket.tank = data.tank;
        socket.broadcast.emit('draw map', JSON.stringify(data));
    });

    // when a tank disconnect
    socket.on('disconnect', function () {
        socket.broadcast.emit('logout', socket.tank);
    });
});
