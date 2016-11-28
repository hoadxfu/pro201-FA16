// Object Tank
function Tank(name, color, xPos, yPos, angle) {
    this.name = name;
    this.color = color;
    this.xPos = xPos;
    this.yPos = yPos;
    this.angle = angle;
    this.size = 15;
}
Tank.prototype.draw = function(ctx) {
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
