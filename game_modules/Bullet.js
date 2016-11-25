var Entity = require('./Entity.js');
var Tank = require('./Tank.js');

var Bullet = function(parent, x, y, angle) {
    var self = Entity(x, y, angle);
    self.id = Math.random();
    self.speed = 10;
    self.spdX = Math.cos(angle) * self.speed;
    self.spdY = Math.sin(angle) * self.speed;
    self.parent = parent;
    self.timer = 0;
    self.toRemove = false;
    var super_update = self.update;
    self.update = function() {
        if (self.timer++ > 100)
            self.toRemove = true;
        super_update();

        for (var i in Tank.list) {
            var p = Tank.list[i];
            if (self.getDistance(p) < 32 && self.parent !== p.id) {
                //handle collision. ex: hp--;
                self.toRemove = true;
            }
        }
    }
    Bullet.list[self.id] = self;
    return self;
}
Bullet.list = {};

Bullet.update = function() {
    var pack = [];
    for (var i in Bullet.list) {
        var bullet = Bullet.list[i];
        bullet.update();
        if (bullet.toRemove)
            delete Bullet.list[i];
        else
            pack.push({
                x: bullet.x,
                y: bullet.y,
            });
    }
    return pack;
}

module.exports = Bullet;