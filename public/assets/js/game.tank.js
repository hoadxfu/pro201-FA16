// Object Tank
function Tank(name, color, xPos, yPos, angle) {
    this.name = name;
    this.color = color;
    this.xPos = xPos;
    this.yPos = yPos;
    this.angle = angle;
}
Tank.prototype.size = 20;
Tank.prototype.speed = 2;
Tank.prototype.shootRate = 500;
Tank.prototype.inBound = function() {
    return this.xPos - this.size >= 0 && this.yPos - this.size >= 0 && this.xPos + this.size <= _gameArea.width && this.yPos + this.size <= _gameArea.width;
}
Tank.prototype.clear = function() {
    ctx.save();
    ctx.translate(this.xPos, this.yPos);
    ctx.rotate(this.angle);
    ctx.clearRect(- this.size - 1, - this.size - 1, this.size * 3 + 2, this.size * 2 + 2);
    ctx.restore();
}
Tank.prototype.draw = function() {
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.xPos, this.yPos);
    if (this.angle !== 0) ctx.rotate(this.angle);
    ctx.arc(0, 0, this.size, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.rect(0, 0 - this.size / 2, this.size * 2, this.size);
    var grd = ctx.createLinearGradient(0, 0, 170, 0);
    grd.addColorStop(0, this.color);
    grd.addColorStop(1, '#fff');
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.restore();
}
Tank.prototype.shooting = function(bullets) {
    var now = (new Date()).getTime();
    if (now - lastShootTime < this.shootRate) return;
    lastShootTime = now;
    bullets.push(new Bullet(
        this.xPos + (this.size * 2 + 8) * Math.cos(this.angle),
        this.yPos + (this.size * 2 + 8) * Math.sin(this.angle),
        this.angle
    ));
}
Tank.prototype.update = function(newXPos, newYPos, newAngle) {
    this.xPos = newXPos;
    this.yPos = newYPos;
    this.angle = newAngle;
}
