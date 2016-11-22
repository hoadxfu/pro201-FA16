// Object Bullet
function Bullet(xPos, yPos, angle) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.angle = angle;
}
Bullet.prototype.size = 6;
Bullet.prototype.speed = 4;
Bullet.prototype.active = true;
Bullet.prototype.inBound = function() {
    return this.xPos - this.size >= 0 && this.yPos - this.size >= 0 && this.xPos + this.size <= _gameArea.width && this.yPos + this.size <= _gameArea.width;
}
Bullet.prototype.update = function() {
    this.xPos += this.speed * Math.cos(this.angle);
    this.yPos += this.speed * Math.sin(this.angle);
    this.active = this.active && this.inBound();
}
Bullet.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.xPos, this.yPos, this.size, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();
}
Bullet.prototype.clear = function() {
    ctx.clearRect(this.xPos - this.size - 5, this.yPos - this.size - 5, this.size * 2 + 10, this.size* 2 + 10);
}
