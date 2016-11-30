var Entity = require('./Entity.js');
var Bullet = require('./Bullet.js');
var GameBound = require('./GameBound.js');

var Tank = function(id, name, color, x, y, angle) {
    var self = Entity(x, y, angle);
    var Bounds = GameBound();
    self.id = id;
    self.name = name;
    self.color = color;
    self.pressingRight = false;
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.pressingAttack = false;
    self.mouseAngle = 0;
    self.maxSpd = 3;
    self.size = 15;
    self.lastShootTime = 0;
    self.shootRate = 300;

    var super_update = self.update;
    // var super_disPxtoPy = self.disPxtoPy;
    var super_disSegmentAtoPx = self.disSegmentAtoPx;
    var super_squareTank = self.squareTank;
    self.update = function() {
        var f = true;
        var f2 = true;
        var tempi;
        for (var i = 0; i < Bounds.length; i++) {
            var pos = super_disSegmentAtoPx(Bounds[i].x1, Bounds[i].y1, Bounds[i].x2, Bounds[i].y2, self.size, self.angle);
            if (pos == 1) self.pressingRight = false;
            if (pos == 2) self.pressingLeft = false;
            if (pos == 3) self.pressingUp = false;
            if (pos == 4) self.pressingDown = false;
            if (pos > 0) {
                tempi = i;
                break;
            }
        }
        super_update();
        if (typeof Bounds[tempi] != 'undefined')
            f2 = super_squareTank(Bounds[tempi].x1, Bounds[tempi].y1, Bounds[tempi].x2, Bounds[tempi].y2, self.size, self.angle);
        if (f2) {
            self.angle = self.mouseAngle;
            if (self.pressingAttack) {
                self.shootBullet(self.mouseAngle);
            }
        }
        f2 = true;
        self.updateSpd();
        // for (var i = 0; i < Bounds.length; i++) {
        //   if (super_squareTank(Bounds[i].x1, Bounds[i].y1, Bounds[i].x2, Bounds[i].y2, self.size, self.angle) == false) {
        //     f2 = false;
        //     break;
        //   }
        // }
        // if (f2) {
        //   //do sth
        // }
        // self.angle = self.mouseAngle;
        // self.updateSpd();
        // if (self.pressingAttack) {
        //     self.shootBullet(self.mouseAngle);
        // }
    }

    self.shootBullet = function(angle) {
        var now = (new Date()).getTime();
        if (now - self.lastShootTime < this.shootRate) return;
        self.lastShootTime = now;
        var b = Bullet(self.id, self.x + (self.size * 2 + 8) * Math.cos(self.angle),
            self.y + (self.size * 2 + 8) * Math.sin(self.angle), angle);
    }


    self.updateSpd = function() {
        if (self.pressingRight)
            self.spdX = self.maxSpd;
        else if (self.pressingLeft)
            self.spdX = -self.maxSpd;
        else
            self.spdX = 0;

        if (self.pressingUp)
            self.spdY = -self.maxSpd;
        else if (self.pressingDown)
            self.spdY = self.maxSpd;
        else
            self.spdY = 0;
    }
    Tank.list[id] = self;
    return self;
}
Tank.list = {};
Tank.onConnect = function(socket) {
    var tank = Tank(socket.id, socket.name, socket.color, socket.x, socket.y, socket.angle);
    socket.on('keyPress', function(data) {
        if (data.inputId === 'left')
            tank.pressingLeft = data.state;
        else if (data.inputId === 'right')
            tank.pressingRight = data.state;
        else if (data.inputId === 'up')
            tank.pressingUp = data.state;
        else if (data.inputId === 'down')
            tank.pressingDown = data.state;
        else if (data.inputId === 'attack')
            tank.pressingAttack = data.state;
    });
    socket.on('mouseMove', function(data) {
        tank.mouseAngle = Math.atan2(data.y - tank.y, data.x - tank.x);
    });
}
Tank.onDisconnect = function(socket) {
    delete Tank.list[socket.id];
}
Tank.update = function() {
    var pack = [];
    for (var i in Tank.list) {
        var tank = Tank.list[i];
        tank.update();
        pack.push({
            name: tank.name,
            color: tank.color,
            x: tank.x,
            y: tank.y,
            angle: tank.angle,
        });
    }
    return pack;
}

module.exports = Tank;
