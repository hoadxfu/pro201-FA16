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
    self.shootRate = 400;
    self.status = 0;
    var super_update = self.update;
    // var super_disPxtoPy = self.disPxtoPy;
    var super_disSegmentAtoPx = self.disSegmentAtoPx;
    var super_squareTank = self.squareTank;
    self.update = function() {
        var f = true;
        var f2 = true;
        var tempi, pos, pos2;
        for (var i = 0; i < Bounds.length; i++) {
            pos = super_disSegmentAtoPx(Bounds[i].x1, Bounds[i].y1, Bounds[i].x2, Bounds[i].y2, self.size, self.mouseAngle);
            if (pos == 1) self.updateSpd(1, 0);
            if (pos == 2) self.updateSpd(2, 0);
            if (pos == 3) self.updateSpd(3, 0);
            if (pos == 4) self.updateSpd(4, 0);
            if (pos > 0) {
                for (var j = 0; j < Bounds.length; j++) {
                    pos2 = super_disSegmentAtoPx(Bounds[j].x1, Bounds[j].y1, Bounds[j].x2, Bounds[j].y2, self.size, self.mouseAngle);
                    if (i != j && pos2 > 0) {
                        if (pos2 == 1) self.updateSpd(1, pos);
                        if (pos2 == 2) self.updateSpd(2, pos);
                        if (pos2 == 3) self.updateSpd(3, pos);
                        if (pos2 == 4) self.updateSpd(4, pos);
                        break;
                    }
                }
                tempi = i;
                break;
            }
        }
        super_update();
        if (typeof Bounds[tempi] != 'undefined')
            f2 = super_squareTank(Bounds[tempi].x1, Bounds[tempi].y1, Bounds[tempi].x2, Bounds[tempi].y2, self.size, self.mouseAngle);
        if (f2) {
            self.angle = self.mouseAngle;
            if (self.pressingAttack) {
                self.shootBullet(self.mouseAngle);
            }
        }
        self.updateSpd(0, 0);
    }

    self.shootBullet = function(angle) {
        var now = (new Date()).getTime();
        if (now - self.lastShootTime < this.shootRate) return;
        self.lastShootTime = now;
        var b = Bullet(self.id, self.x + (self.size * 2 + 1) * Math.cos(self.angle),
            self.y + (self.size * 2 + 1) * Math.sin(self.angle), angle, Tank.list);
    }


    self.updateSpd = function(modeSpd1, modeSpd2) {
        var tempU = self.pressingUp;
        var tempD = self.pressingDown;
        var tempL = self.pressingLeft;
        var tempR = self.pressingRight;
        switch (modeSpd1) {
          case 1:
              tempR = false;
              if (modeSpd2 == 2) tempL = false;
              if (modeSpd2 == 3) tempU = false;
              if (modeSpd2 == 4) tempD = false;
              break;
          case 2:
              tempL = false;
              if (modeSpd2 == 1) tempR = false;
              if (modeSpd2 == 3) tempU = false;
              if (modeSpd2 == 4) tempD = false;
              break;
          case 3:
              tempU = false;
              if (modeSpd2 == 1) tempR = false;
              if (modeSpd2 == 2) tempL = false;
              if (modeSpd2 == 4) tempD = false;
              break;
          case 4:
              tempD = false;
              if (modeSpd2 == 1) tempR = false;
              if (modeSpd2 == 2) tempL = false;
              if (modeSpd2 == 3) tempU = false;
              break;
        }
        if (modeSpd1 == 0) {
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
        } else {
            if (tempR)
                self.spdX = self.maxSpd;
            else if (tempL)
                self.spdX = -self.maxSpd;
            else
                self.spdX = 0;

            if (tempU)
                self.spdY = -self.maxSpd;
            else if (tempD)
                self.spdY = self.maxSpd;
            else
                self.spdY = 0;
        }
    }
    Tank.list[id] = self;
    return self;
}
Tank.list = {};
Tank.onConnect = function(socket) {
    var tank = Tank(socket.id, socket.name, socket.color, socket.x, socket.y, socket.angle);
    socket.emit('tankId', socket.id);
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
    socket.on('changeStatus', function(data) {
        if (typeof Tank.list[data.id] != 'undefined') {
            Tank.list[data.id].status = data.status;
            if (data.status == 0) {
                Tank.list[data.id].x = Math.floor((Math.random() * (Math.floor((Math.random() * 12) + 1)) * (1166 / 13 + Tank.list[data.id].size)) + 1);
                Tank.list[data.id].y = Math.floor((Math.random() * (Math.floor((Math.random() * 6) + 1)) * (550 / 7 + Tank.list[data.id].size)) + 1);
            }
        }
    });
}
Tank.onDisconnect = function(socket) {
    delete Tank.list[socket.id];
}
Tank.update = function() {
    var pack = [];
    if (typeof Bullet.tankList != 'undefined') {
        Tank.list = Bullet.tankList;
    }
    for (var i in Tank.list) {
        var tank = Tank.list[i];
        tank.update();
        pack.push({
            id: tank.id,
            name: tank.name,
            color: tank.color,
            x: tank.x,
            y: tank.y,
            angle: tank.angle,
            status: tank.status
        });
    }
    return pack;
}

module.exports = Tank;
