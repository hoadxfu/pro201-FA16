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
// function check distance between 2 point

Tank.prototype.disPxtoPy = function (xPos1, yPos1, xPos2, yPos2) {
  var width = Math.abs(xPos1-xPos2);
  var height = Math.abs(yPos1-yPos2);
  var distance = Math.sqrt(width*width + height*height);
  if (distance <= 50){
    console.log("Ok");
  }
}

// function check distance between 1 segment to 1 point
// segment(x1, y1, x2, y2)
// khoang cach tu 1 diem C(x3, y3) den duong thang tao boi 2 diem A(x1,y1) và B(x2, y2)

Tank.prototype.disSegmentAtoPx = function(x1, y1, x2, y2, x3, y3) {
  var xMin = Math.min(x1, x2);
  var xMax = Math.max(x1, x2);
  var yMin = Math.min(y1, y2);
  var yMax = Math.max(y1, y2);
  var f = Math.abs((y2-y1)*(x3-x1) - (x2-x1)*(y3-y1));
  console.log(f);
  if (f < 10000 && (x3 >= xMin && x3 <= xMax) && (y3 >= yMin && y3 <= yMax)) {
    console.log("distance 0");
  }
}
