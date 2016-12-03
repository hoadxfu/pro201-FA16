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
            var xMin = Math.min(x1, x2) -2*size;
            var xMax = Math.max(x1, x2) + 2*size;
            var yMin = Math.min(y1, y2) - 2*size;
            var yMax = Math.max(y1, y2) + 2*size;
            var distance;
            if (x1 == x2)
              distance = Math.abs(self.x - x1);
            if (y1 == y2)
              distance = Math.abs(self.y - y1);
            if (distance < 3*size && (self.x >= xMin && self.x < xMax) && (self.y >= yMin && self.y < yMax)) {
                if (x1 == x2) {
                  return 1;
                } else {
                  return 2;
                }
            }
            return 0;
        }

    self.disSegmentAtoPx = function(x1, y1, x2, y2, size, angle) {
        var xMin = Math.min(x1, x2) - size;
        var xMax = Math.max(x1, x2) + size;
        var yMin = Math.min(y1, y2) - size;
        var yMax = Math.max(y1, y2) + size;

        var xMinQ = Math.min(x1, x2) - (size / 2 + 1);
        var xMaxQ = Math.max(x1, x2) + (size / 2 + 1);
        var yMinQ = Math.min(y1, y2) - (size / 2 + 1);
        var yMaxQ = Math.max(y1, y2) + (size / 2) + 1;
        // tam hinh tron tank
        var newXPos = self.x + self.spdX;
        var newYPos = self.y + self.spdY;
        // tam hinh vuong tank
        var xq = newXPos + 1.5 * size * Math.cos(angle);
        var yq = newYPos + 1.5 * size * Math.sin(angle);
        var dis = Math.abs(((y2 - y1) * (xq - x1) - (x2 - x1) * (yq - y1))) / (Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)));
        var distance = ((y2 - y1) * (newXPos - x1) - (x2 - x1) * (newYPos - y1)) / (Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)));
        if ((Math.abs(distance) <= size && (newXPos >= xMin && newXPos < xMax) && (newYPos >= yMin && newYPos < yMax)) ||
            (dis <= (size / 2 + 1) && (xq >= xMinQ && xq < xMaxQ) && (yq >= yMinQ && yq < yMaxQ))) {
            if (Math.sign(distance) < 0) {
                if (self.x < x1 && self.x < x2) {
                    return 1 //left
                } else {
                    return 3; //under
                }
            } else {
                if (self.x > x1 && self.x > x2) {
                    return 2; //right
                } else {
                    return 4; //on
                }
            }
        }
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

    self.bulletTank = function (xb, yb, xt, yt, sizeb, sizet) {
      if (self.disPxtoPy(xb, yb, xt, yt) <= (sizet+sizeb))
        return false;
      return true;
    }

    return self;
}

module.exports = Entity;
