var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
const uuid = require('uuid');
var Tank = require('./game_modules/Tank.js');
var Bullet = require('./game_modules/Bullet.js');

server.listen(port, function() {
    console.log('Server listening at port %d', port);
});

// Routingjs
app.use(express.static(__dirname + '/public'));

var TANK_LIST = {};
// var ROOM = [0];

io.on('connection', function(socket) {

    socket.on('add tank', function(data) {
        socket.id = uuid();
        socket.name = data.name;
        socket.color = data.color;
        socket.x = data.xPos;
        socket.y = data.yPos;
        socket.angle = data.angle;
        // ROOM.forEach(function(room, index) {
        //     if (typeof socket.room == 'undefined') {
        //         if (room < 4) {
        //             socket.room = index;
        //             ROOM[socket.room]++;
        //             return;
        //         } else {
        //             socket.room = ROOM.length;
        //             ROOM.push(1);
        //         }
        //     }
        // });
        // socket.join('room ' + socket.room);

        TANK_LIST[socket.id] = socket;

        Tank.onConnect(socket);
    });

    socket.on('disconnect', function() {
        // ROOM[socket.room]--;
        // socket.leave('room ' + socket.room);
        delete TANK_LIST[socket.id];
        Tank.onDisconnect(socket);
    });

});

setInterval(function() {
    var pack = {
        tank: Tank.update(),
        bullet: Bullet.update(),
    }
    for (var i in TANK_LIST) {
        var socket = TANK_LIST[i];
        socket.emit('newPositions', pack);
    }
}, 1000 / 30);
