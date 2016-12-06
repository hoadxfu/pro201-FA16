var Entity = function(x, y, angle) {
    var self = {
        x: x,
        y: y,
        angle: angle,
        spdX: 0,
        spdY: 0,
        id: "",
    }
    self.update = function() {
        self.updatePosition();
    }
    self.updatePosition = function() {
        self.x += self.spdX;
        self.y += self.spdY;
    }
    self.getDistance = function(pt) {
        return Math.sqrt(Math.pow(self.x - pt.x, 2) + Math.pow(self.y - pt.y, 2));
    }

    self.disPxtoPy = function(xPos1, yPos1, xPos2, yPos2) {
        var width = Math.abs(xPos2 - xPos1);
        var height = Math.abs(yPos2 - yPos1);
        var distance = Math.sqrt(width * width + height * height);
        return distance;
    }

    self.disBullet = function(x1, y1, x2, y2, size) {
        var xMin = Math.min(x1, x2) - 5;
        var xMax = Math.max(x1, x2) + 5;
        var yMin = Math.min(y1, y2) - 5;
        var yMax = Math.max(y1, y2) + 5;
        var distance;
        if (x1 == x2){
          distance = Math.abs(self.x - x1);
        }
        if (y1 == y2){
          distance = Math.abs(self.y - y1);
        }
        var d1 = self.disPxtoPy(self.x, self.y, x1, y1);
        var d2 = self.disPxtoPy(self.x, self.y, x2, y2);
        var d3 = self.disPxtoPy(x1, y1, x2, y2) - 4;
        if (distance <  size && (self.x >= xMin && self.x < xMax) && (self.y >= yMin && self.y < yMax)) {
            if (x1 == x2) {
                if (Math.abs(d1-d2) < d3)
                  return 1;
                else {
                  return 2;
                }
            } else {
                if (Math.abs(d1-d2) < d3)
                  return 2;
                else {
                  return 1;
                }
            }
        }
        return 0;
    }


    self.disSegmentAtoPx = function(x1, y1, x2, y2, size, angle) {
        Math.sign = Math.sign || function(x) {
            x = +x; // convert to a number
            if (x === 0 || isNaN(x)) {
                return Number(x);
            }
            return x > 0 ? 1 : -1;
        }

        var xMin = Math.min(x1, x2) -2 ;
        var xMax = Math.max(x1, x2) + 2;
        var yMin = Math.min(y1, y2) - 2;
        var yMax = Math.max(y1, y2) + 2;

        // tam hinh tron tank
        var newXPos = self.x + self.spdX;
        var newYPos = self.y + self.spdY;
        // tam hinh vuong tank
        var xq = newXPos + 1.5 * size * Math.cos(angle);
        var yq = newYPos + 1.5 * size * Math.sin(angle);
        var dis = Math.abs(((y2 - y1) * (xq - x1) - (x2 - x1) * (yq - y1))) / (Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)));
        var distance = ((y2 - y1) * (newXPos - x1) - (x2 - x1) * (newYPos - y1)) / (Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)));

        var dc1 = self.disPxtoPy(newXPos, newYPos, xMin, yMin);
        var dq1 = self.disPxtoPy(xq, yq, xMin, yMin);
        var dc2 = self.disPxtoPy(newXPos, newYPos, xMax, yMax);
        var dq2 = self.disPxtoPy(xq, xq, xMax, yMax);

        var sign = Math.sign(distance);
        if (x1 == x2) {
          if ((Math.abs(distance) <= size  || dis <= size/2) && newYPos < yMax && newYPos > yMin
                 ) {
            if (sign < 0) {
              return 1;
            } else {
              return 2;
            }
          } else if ((dc1 <= size || dq1 <= size/2) && newYPos <= yMin+5){
            return 4;
          } else if ((dc2 <= size || dq2 <= size) && newYPos >= yMax-5){
            return 3;
          } else {
            return 0;
          }
        } else {
          if ((Math.abs(distance) <= size || dis <= size/2) && newXPos < xMax && newXPos > xMin
                 ) {
            if (sign < 0) {
              return 3;
            } else {
              return 4;
            }
          } else if ((dc1 <= size && newXPos <= xMin) || (dq1 <= size/2 && xq <= xMin)){
            return 1;
          } else if ((dc2 <= size && newXPos >= xMax) || (dq2 <= 2*size && xq >= xMax)){
            return 2;
          } else {
            return 0;
          }
        }

        // if ((Math.abs(distance) <= size && (newXPos >= xMin && newXPos < xMax) && (newYPos >= yMin && newYPos < yMax)) ||
        //     (dis <= (size / 2 + 1) && (xq >= xMinQ && xq < xMaxQ) && (yq >= yMinQ && yq < yMaxQ))) {
        //     if (Math.sign(distance) < 0) {
        //         if (self.x < x1 && self.x < x2) {
        //             return 1 //left
        //         } else {
        //             return 3; //under
        //         }
        //     } else {
        //         if (self.x > x1 && self.x > x2) {
        //             return 2; //right
        //         } else {
        //             return 4; //on
        //         }
        //     }
        // }
        return 0;
    }

    self.squareTank = function(x1, y1, x2, y2, size, angle) {
        var xMint = Math.min(x1, x2) - (size / 2 + 1);
        var xMaxt = Math.max(x1, x2) + (size / 2 + 1);
        var yMint = Math.min(y1, y2) - (size / 2 + 1);
        var yMaxt = Math.max(y1, y2) + (size / 2) + 1;
        var newXPos = self.x + self.spdX;
        var newYPos = self.y + self.spdY;
        var xq = newXPos + 1.5 * size * Math.cos(angle);
        var yq = newYPos + 1.5 * size * Math.sin(angle);
        var dis = Math.abs(((y2 - y1) * (xq - x1) - (x2 - x1) * (yq - y1))) / (Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)));
        if (dis <= (size / 2 + 2)) {
            return false;
        } else {
            return true;
        }
    }

    self.bulletTank = function(xb, yb, xt, yt, sizeb, sizet, angle) {
        var xq = xt + 1.5 * sizet * Math.cos(angle);
        var yq = yt + 1.5 * sizet * Math.sin(angle);
        if (self.disPxtoPy(xb, yb, xt, yt) <= (sizet + sizeb) - 4 || self.disPxtoPy(xb, yb, xq, yq) <= (sizet/2 + sizeb) - 4)
            return false;
        return true;
    }

    return self;
}

module.exports = Entity;
