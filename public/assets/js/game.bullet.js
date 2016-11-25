// Object Bullet
function Bullet(xPos, yPos, angle) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.angle = angle;
    this.size = 4;
}
Bullet.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.arc(this.xPos, this.yPos, this.size, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();
}
