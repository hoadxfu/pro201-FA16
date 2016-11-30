var Entity = require('./Entity.js');
var Tank = require('./Tank.js');
var GameBound = require('./GameBound.js');

var Bullet = function(parent, x, y, angle) {
    var self = Entity(x, y, angle);
    var Bounds = GameBound();
    self.id = Math.random();
    self.speed = 10;
    self.spdX = Math.cos(angle) * self.speed;
    self.spdY = Math.sin(angle) * self.speed;
    self.parent = parent;
    self.timer = 0;
    self.size = 4;
    self.toRemove = false;
    var super_update = self.update;
    var super_disBullet = self.disBullet;
    self.update = function() {
        if (self.timer++ > 100)
            self.toRemove = true;
        super_update();

        for (var i = 0; i < Bounds.length; i++){
          if (super_disBullet(Bounds[i].x1, Bounds[i].y1, Bounds[i].x2, Bounds[i].y2, self.size) == false){
            self.toRemove = true;
          }
        }

        // for (var i in Tank.list) {
        //     var p = Tank.list[i];
        //     if (self.getDistance(p) < 32 && self.parent !== p.id) {
        //         //handle collision. ex: hp--;
        //         self.toRemove = true;
        //     }
        // }
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
