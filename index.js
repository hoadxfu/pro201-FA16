var server = require('http').createServer(),
    url = require('url'),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        server: server
    }),
    express = require('express'),
    app = express(),
    port = 8080,
    path = require('path');

app.use(express.static(path.join(__dirname, '/public')));

wss.broadcast = function(data) {
    for (var i in this.clients)
        this.clients[i].send(data);
};

wss.on('connection', function connection(ws) {
    var location = url.parse(ws.upgradeReq.url, true);
    // you might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    ws.on('message', function(data) {
        console.log(data);
        wss.broadcast(JSON.stringify({ message: 'Gotcha' }));
    });

});

server.on('request', app);
server.listen(port, function() {
    console.log('Listening on ' + server.address().port)
});

// io.on('connection', function(socket) {
//
//     // when the client emits 'add tank', this listens and executes
//     socket.on('add tank', function(tank) {
//         // we store the tankname in the socket session for this client
//         socket.tank = tank;
//         ++numTanks;
//         socket.emit('draw tank', tank);
//     });
//
//     socket.on('reload map', function(data) {
//         socket.tank = data.tank;
//         io.sockets.emit('draw map', data);
//     });
//
//     // when a tank disconnect
//     socket.on('disconnect', function () {
//         io.sockets.emit('logout', socket.tank);
//     });
// });
