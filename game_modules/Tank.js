var Entity = require('./Entity.js');
var Bullet = require('./Bullet.js');

// Set gameBound
var _gameAreawidth = 1366 - 200;
var _gameAreaheight = 550;

function gameBound(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
}
var Bounds = [];
function setBound() {
  var height_cell = _gameAreaheight/7;
  var width_cell = _gameAreawidth/14;
  // 4 duong bao quanh map
  Bounds.push(new gameBound(0, 0, _gameAreawidth, 0));
  Bounds.push(new gameBound(0, 0, 0, _gameAreaheight));
  Bounds.push(new gameBound(0, _gameAreaheight, _gameAreawidth, _gameAreaheight));
  Bounds.push(new gameBound(_gameAreawidth, _gameAreaheight, _gameAreawidth, 0));
  // end
  // tuong ben trong Map
  Bounds.push(new gameBound(width_cell, 0, width_cell, height_cell));
  Bounds.push(new gameBound(2*width_cell, height_cell, 7*width_cell, height_cell));
  Bounds.push(new gameBound(8*width_cell, 0, 8*width_cell, 2*height_cell));
  Bounds.push(new gameBound(9*width_cell, height_cell, 10*width_cell, height_cell));
  Bounds.push(new gameBound(9*width_cell, height_cell, 9*width_cell, 2*height_cell));
  Bounds.push(new gameBound(11*width_cell, 0, 11*width_cell, 2*height_cell));
  Bounds.push(new gameBound(11*width_cell, height_cell, 12*width_cell, height_cell));
  Bounds.push(new gameBound(13*width_cell, height_cell, 14*width_cell, height_cell));
  Bounds.push(new gameBound(0, 2*height_cell, width_cell, 2*height_cell));
  Bounds.push(new gameBound(width_cell, 2*height_cell, width_cell, 3*height_cell));
  Bounds.push(new gameBound(width_cell, 3*height_cell, 2*width_cell, 3*height_cell));
  Bounds.push(new gameBound(width_cell, 4*height_cell, width_cell, 7*height_cell));
  Bounds.push(new gameBound(width_cell, 4*height_cell, 2*width_cell, 4*height_cell));
  Bounds.push(new gameBound(width_cell, 5*height_cell, 3*width_cell, 5*height_cell));
  Bounds.push(new gameBound(2*width_cell, 6*height_cell, 4*width_cell, 6*height_cell));
  Bounds.push(new gameBound(4*width_cell, 4*height_cell, 4*width_cell, 6*height_cell));
  Bounds.push(new gameBound(3*width_cell, 4*height_cell, 6*width_cell, 4*height_cell));
  Bounds.push(new gameBound(6*width_cell, 4*height_cell, 6*width_cell, 5*height_cell));
  Bounds.push(new gameBound(5*width_cell, 5*height_cell, 5*width_cell, 6*height_cell));
  Bounds.push(new gameBound(5*width_cell, 6*height_cell, 8*width_cell, 6*height_cell));
  Bounds.push(new gameBound(7*width_cell, 4*height_cell, 7*width_cell, 5*height_cell));
  Bounds.push(new gameBound(7*width_cell, 4*height_cell, 8*width_cell, 4*height_cell));
  Bounds.push(new gameBound(8*width_cell, 4*height_cell, 8*width_cell, 7*height_cell));
  Bounds.push(new gameBound(8*width_cell, 5*height_cell, 9*width_cell, 5*height_cell));
  Bounds.push(new gameBound(9*width_cell, 5*height_cell, 9*width_cell, 6*height_cell));
  Bounds.push(new gameBound(10*width_cell, 5*height_cell, 10*width_cell, 7*height_cell));
  Bounds.push(new gameBound(11*width_cell, 5*height_cell, 11*width_cell, 7*height_cell));
  Bounds.push(new gameBound(12*width_cell, 4*height_cell, 12*width_cell, 6*height_cell));
  Bounds.push(new gameBound(12*width_cell, 4*height_cell, 13*width_cell, 4*height_cell));
  Bounds.push(new gameBound(13*width_cell, 4*height_cell, 13*width_cell, 7*height_cell));
  Bounds.push(new gameBound(2*width_cell, 2*height_cell, 4*width_cell, 2*height_cell));
  Bounds.push(new gameBound(3*width_cell, height_cell, 3*width_cell, 2*height_cell));
  Bounds.push(new gameBound(3*width_cell, 3*height_cell, 5*width_cell, 3*height_cell));
  Bounds.push(new gameBound(5*width_cell, 3*height_cell, 5*width_cell, height_cell));
  Bounds.push(new gameBound(6*width_cell, 2*height_cell, 7*width_cell, 2*height_cell));
  Bounds.push(new gameBound(7*width_cell, 2*height_cell, 7*width_cell, 3*height_cell));
  Bounds.push(new gameBound(6*width_cell, 3*height_cell, 11*width_cell, 3*height_cell));
  Bounds.push(new gameBound(9*width_cell, 3*height_cell, 9*width_cell, 4*height_cell));
  Bounds.push(new gameBound(9*width_cell, 4*height_cell, 10*width_cell, 4*height_cell));
  Bounds.push(new gameBound(11*width_cell, 3*height_cell, 11*width_cell, 4*height_cell));
  Bounds.push(new gameBound(10*width_cell, 2*height_cell, 12*width_cell, 2*height_cell));
  Bounds.push(new gameBound(12*width_cell, 3*height_cell, 13*width_cell, 3*height_cell));
  Bounds.push(new gameBound(13*width_cell, 3*height_cell, 13*width_cell, 2*height_cell));
  // End
}

var Tank = function(id, name, color, x, y, angle) {
    var self = Entity(x, y, angle);
    self.id = id;
    self.name = name;
    self.color = color;
    self.pressingRight = false;
    self.pressingLeft = false;
    self.pressingUp = false;
    self.pressingDown = false;
    self.pressingAttack = false;
    self.mouseAngle = 0;
    self.maxSpd = 6;
    self.size = 15;
    self.lastShootTime = 0;
    self.shootRate = 300;

    var super_update = self.update;
    var super_disPxtoPy = self.disPxtoPy;
    var super_disSegmentAtoPx = self.disSegmentAtoPx;

    setBound();
    self.update = function() {
        var f;
        for (var i = 0; i < Bounds.length; i++){
          if (super_disSegmentAtoPx(Bounds[i].x1, Bounds[i].y1, Bounds[i].x2, Bounds[i].y2, self.size) == false) {
            f = false;
            break;
          } else {
            f = true;
          }
        }
        if (f) {
            super_update();
        }
        self.angle = self.mouseAngle;
        self.updateSpd();
        if (self.pressingAttack) {
            self.shootBullet(self.mouseAngle);
        }
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
