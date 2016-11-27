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

    self.disPxtoPy = function(xPos, yPos) {
        var width = Math.abs(self.x - xPos);
        var height = Math.abs(self.y - yPos);
        var distance = Math.sqrt(width * width + height * height);
        if (distance <= 10) {
            return false;
        }
        return true;
    }

    self.disSegmentAtoPx = function(x1, y1, x2, y2, size) {
        var xMin = Math.min(x1, x2) - size;
        var xMax = Math.max(x1, x2) + size;
        var yMin = Math.min(y1, y2) - size;
        var yMax = Math.max(y1, y2) + size;
        var newXPos = self.x + self.spdX;
        var newYPos = self.y + self.spdY;

        var distanceArr = [];
        function distance(x, y) {
          return Math.abs(((y2 - y1) * (x - x1) - (x2 - x1) * (y - y1))) / (Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)));
        }
        distanceArr.push(distance(newXPos, newYPos));
        for (var i = 0; i < distanceArr.length; i++) {
          if (distanceArr[i] < size && (newXPos >= xMin && newXPos < xMax) && (newYPos >= yMin && newYPos < yMax)) {
              return false;
          }
        }
        return true;
    }
    // Backup
    // self.disSegmentAtoPx = function(x1, y1, x2, y2, size) {
    //     var xMin = Math.min(x1, x2) - size;
    //     var xMax = Math.max(x1, x2) + size;
    //     var yMin = Math.min(y1, y2) - size;
    //     var yMax = Math.max(y1, y2) + size;
    // var newXPos = self.x + self.spdX;
    // var newYPos = self.y + self.spdY;
    //     var distance = ((y2 - y1) * (newXPos - x1) - (x2 - x1) * (newYPos - y1)) / (Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)));
    //     if (Math.abs(distance) <= size && (newXPos >= xMin && newXPos < xMax) && (newYPos >= yMin && newYPos < yMax)) {
    //         return false;
    //     }
    //     return true;
    // }

    return self;
}

module.exports = Entity;
