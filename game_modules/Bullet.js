var Entity = require('./Entity.js');
var Tank = require('./Tank.js');
var GameBound = require('./GameBound.js');

var Bullet = function(parent, x, y, angle, tankList) {
    var self = Entity(x, y, angle);
    var Bounds = GameBound();
    self.tankList = tankList;
    self.id = Math.random();
    self.speed = 2.5;
    self.spdX = Math.cos(self.angle) * self.speed;
    self.spdY = Math.sin(self.angle) * self.speed;
    self.parent = parent;
    self.timer = 0;
    self.size = 7;
    self.toRemove = false;
    var super_update = self.update;
    var super_disBullet = self.disBullet;
    var super_bulletTank = self.bulletTank;
    self.update = function() {
        if (self.timer++ > 1000)
            self.toRemove = true;

        super_update();

        for (var i = 0; i < Bounds.length; i++) {
            var re = super_disBullet(Bounds[i].x1, Bounds[i].y1, Bounds[i].x2, Bounds[i].y2, self.size);

            if (re != 0) {
                // self.toRemove = true;
                if (re == 2) {
                    self.angle = -self.angle;
                    self.spdX = Math.cos(self.angle) * self.speed;
                    self.spdY = Math.sin(self.angle) * self.speed;
                }
                if (re == 1) {
                    self.angle = (Math.PI - self.angle);
                    self.spdX = Math.cos(self.angle) * self.speed;
                    self.spdY = Math.sin(self.angle) * self.speed;
                }

            }
        }
        for (var i in self.tankList)
            if (self.tankList[i].status == 0) {
                var tank = self.tankList[i];
                if (super_bulletTank(self.x, self.y, tank.x, tank.y, self.size, tank.size, tank.angle) == false) {
                    //handle collision. ex: hp--;
                    self.tankList[i].status = 1;
                    self.tankList[i].killBy = self.parent;
                    if (self.parent != i)
                        self.tankList[self.parent].killCount++;
                }
            }
    }
    Bullet.list[self.id] = self;
    return self;
}
Bullet.list = {};

Bullet.countTotal = function(tankId) {
    var count = 0;
    for (var i in Bullet.list) {
        var bullet = Bullet.list[i];
        if (bullet.parent == tankId) count++;
    }
    return count;
}

Bullet.update = function() {
    var pack = [];
    for (var i in Bullet.list) {
        var bullet = Bullet.list[i];
        bullet.update();
        if (bullet.toRemove) {
            if (typeof bullet.tankList[bullet.parent] != 'undefined')
                bullet.tankList[bullet.parent].countBullet--;
            delete Bullet.list[i];
        } else
            pack.push({
                parent: bullet.parent,
                x: bullet.x,
                y: bullet.y,
            });
    }
    return pack;
}

module.exports = Bullet;
