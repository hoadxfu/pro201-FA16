function Wall(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
}
Wall.prototype.lineDraw = function(ctx) {
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineWidth = 2;
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
}
