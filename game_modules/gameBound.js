function Wall(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
}

var GameBound = function() {
    // Set gameBound
    var _gameAreawidth = 1366 - 200;
    var _gameAreaheight = 550;

    var Bounds = [];
    var wallwidth = 3;
    var height_cell = _gameAreaheight / 7;
    var width_cell = _gameAreawidth / 14;

    // 4 duong bao quanh map
    Bounds.push(new Wall(0, 0, _gameAreawidth, 0));
    Bounds.push(new Wall(0, 0, 0, _gameAreaheight));
    Bounds.push(new Wall(0, _gameAreaheight, _gameAreawidth, _gameAreaheight));
    Bounds.push(new Wall(_gameAreawidth, _gameAreaheight, _gameAreawidth, 0));
    // end
    // tuong ben trong Map
    Bounds.push(new Wall(width_cell, 0, width_cell, height_cell));
    Bounds.push(new Wall(2 * width_cell, height_cell, 7 * width_cell, height_cell));
    Bounds.push(new Wall(8 * width_cell, 0, 8 * width_cell, 2 * height_cell));
    Bounds.push(new Wall(9 * width_cell + wallwidth, height_cell, 10 * width_cell, height_cell)); ///
    Bounds.push(new Wall(9 * width_cell, height_cell + wallwidth, 9 * width_cell, 2 * height_cell)); ///
    Bounds.push(new Wall(11 * width_cell, 0, 11 * width_cell, 2 * height_cell - wallwidth)); ///
    Bounds.push(new Wall(11 * width_cell + wallwidth, height_cell, 12 * width_cell, height_cell)); ///
    Bounds.push(new Wall(13 * width_cell, height_cell, 14 * width_cell, height_cell));
    Bounds.push(new Wall(0, 2 * height_cell, width_cell - wallwidth, 2 * height_cell)); ///
    Bounds.push(new Wall(width_cell, 2 * height_cell + wallwidth, width_cell, 3 * height_cell - wallwidth)); ///
    Bounds.push(new Wall(width_cell + wallwidth, 3 * height_cell, 2 * width_cell, 3 * height_cell)); ///
    Bounds.push(new Wall(width_cell, 4 * height_cell + wallwidth, width_cell, 7 * height_cell)); ///
    Bounds.push(new Wall(width_cell + wallwidth, 4 * height_cell, 2 * width_cell, 4 * height_cell)); ///
    Bounds.push(new Wall(width_cell + wallwidth, 5 * height_cell, 3 * width_cell, 5 * height_cell)); ///
    Bounds.push(new Wall(2 * width_cell, 6 * height_cell, 4 * width_cell - wallwidth, 6 * height_cell)); ///
    Bounds.push(new Wall(4 * width_cell, 4 * height_cell + wallwidth, 4 * width_cell, 6 * height_cell - wallwidth)); ///
    Bounds.push(new Wall(3 * width_cell, 4 * height_cell, 6 * width_cell - wallwidth, 4 * height_cell)); ///
    Bounds.push(new Wall(6 * width_cell, 4 * height_cell + wallwidth, 6 * width_cell, 5 * height_cell)); ///
    Bounds.push(new Wall(5 * width_cell, 5 * height_cell, 5 * width_cell, 6 * height_cell - wallwidth)); ///
    Bounds.push(new Wall(5 * width_cell + wallwidth, 6 * height_cell, 8 * width_cell - wallwidth, 6 * height_cell)); ///
    Bounds.push(new Wall(7 * width_cell, 4 * height_cell + wallwidth, 7 * width_cell, 5 * height_cell)); ///
    Bounds.push(new Wall(7 * width_cell + wallwidth, 4 * height_cell, 8 * width_cell - wallwidth, 4 * height_cell)); ///
    Bounds.push(new Wall(8 * width_cell, 4 * height_cell + wallwidth, 8 * width_cell, 7 * height_cell)); ///
    Bounds.push(new Wall(8 * width_cell + wallwidth, 5 * height_cell, 9 * width_cell - wallwidth, 5 * height_cell)); ///
    Bounds.push(new Wall(9 * width_cell, 5 * height_cell + wallwidth, 9 * width_cell, 6 * height_cell)); ///
    Bounds.push(new Wall(10 * width_cell, 5 * height_cell, 10 * width_cell, 7 * height_cell));
    Bounds.push(new Wall(11 * width_cell, 5 * height_cell, 11 * width_cell, 7 * height_cell));
    Bounds.push(new Wall(12 * width_cell, 4 * height_cell + wallwidth, 12 * width_cell, 6 * height_cell)); ////
    Bounds.push(new Wall(12 * width_cell + wallwidth, 4 * height_cell, 13 * width_cell - wallwidth, 4 * height_cell)); ///
    Bounds.push(new Wall(13 * width_cell, 4 * height_cell + wallwidth, 13 * width_cell, 7 * height_cell)); ////
    Bounds.push(new Wall(2 * width_cell, 2 * height_cell, 4 * width_cell, 2 * height_cell));
    Bounds.push(new Wall(3 * width_cell, height_cell + wallwidth, 3 * width_cell, 2 * height_cell - wallwidth)); ///
    Bounds.push(new Wall(3 * width_cell, 3 * height_cell, 5 * width_cell - wallwidth, 3 * height_cell)); ///
    Bounds.push(new Wall(5 * width_cell, height_cell + wallwidth, 5 * width_cell, 3 * height_cell - wallwidth)); //
    Bounds.push(new Wall(6 * width_cell, 3 * height_cell, 11 * width_cell - wallwidth, 3 * height_cell)); ///
    Bounds.push(new Wall(9 * width_cell, 3 * height_cell + wallwidth, 9 * width_cell, 4 * height_cell - wallwidth)); ///
    Bounds.push(new Wall(9 * width_cell + wallwidth, 4 * height_cell, 10 * width_cell, 4 * height_cell)); ///
    Bounds.push(new Wall(11 * width_cell, 3 * height_cell + wallwidth, 11 * width_cell, 4 * height_cell)); ///
    Bounds.push(new Wall(10 * width_cell, 2 * height_cell, 12 * width_cell, 2 * height_cell));
    Bounds.push(new Wall(12 * width_cell, 3 * height_cell, 13 * width_cell - wallwidth, 3 * height_cell)); ///
    Bounds.push(new Wall(13 * width_cell, 2 * height_cell, 13 * width_cell, 3 * height_cell - wallwidth)); ///
    // End
    return Bounds;
}

module.exports = GameBound;
