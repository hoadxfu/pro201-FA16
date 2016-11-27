// define
var _COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];

// socket
var socket = io();
// pages & game area
var _loginPage = $('.login'),
    _gamePage = $('.game').hide();
var _gameArea = document.getElementById('game-area');
_gameArea.width = $(window).width() - 200;
_gameArea.height = 550;
var ctx = _gameArea.getContext('2d');

$(document).ready(function() {

  // Push map
  var maps = [];
  var height_cell = _gameArea.height/7;
  var width_cell = _gameArea.width/14;
  // maps.push(new Wall(width_cell, height_cell, width_cell, height_cell));
  maps.push(new Wall(width_cell, 0, width_cell, height_cell));
  maps.push(new Wall(2*width_cell, height_cell, 7*width_cell, height_cell));
  maps.push(new Wall(8*width_cell, 0, 8*width_cell, 2*height_cell));
  maps.push(new Wall(9*width_cell, height_cell, 10*width_cell, height_cell));
  maps.push(new Wall(9*width_cell, height_cell, 9*width_cell, 2*height_cell));
  maps.push(new Wall(11*width_cell, 0, 11*width_cell, 2*height_cell));
  maps.push(new Wall(11*width_cell, height_cell, 12*width_cell, height_cell));
  maps.push(new Wall(13*width_cell, height_cell, 14*width_cell, height_cell));
  maps.push(new Wall(0, 2*height_cell, width_cell, 2*height_cell));
  maps.push(new Wall(width_cell, 2*height_cell, width_cell, 3*height_cell));
  maps.push(new Wall(width_cell, 3*height_cell, 2*width_cell, 3*height_cell));
  maps.push(new Wall(width_cell, 4*height_cell, width_cell, 7*height_cell));
  maps.push(new Wall(width_cell, 4*height_cell, 2*width_cell, 4*height_cell));
  maps.push(new Wall(width_cell, 5*height_cell, 3*width_cell, 5*height_cell));
  maps.push(new Wall(2*width_cell, 6*height_cell, 4*width_cell, 6*height_cell));
  maps.push(new Wall(4*width_cell, 4*height_cell, 4*width_cell, 6*height_cell));
  maps.push(new Wall(3*width_cell, 4*height_cell, 6*width_cell, 4*height_cell));
  maps.push(new Wall(6*width_cell, 4*height_cell, 6*width_cell, 5*height_cell));
  maps.push(new Wall(5*width_cell, 5*height_cell, 5*width_cell, 6*height_cell));
  maps.push(new Wall(5*width_cell, 6*height_cell, 8*width_cell, 6*height_cell));
  maps.push(new Wall(7*width_cell, 4*height_cell, 7*width_cell, 5*height_cell));
  maps.push(new Wall(7*width_cell, 4*height_cell, 8*width_cell, 4*height_cell));
  maps.push(new Wall(8*width_cell, 4*height_cell, 8*width_cell, 7*height_cell));
  maps.push(new Wall(8*width_cell, 5*height_cell, 9*width_cell, 5*height_cell));
  maps.push(new Wall(9*width_cell, 5*height_cell, 9*width_cell, 6*height_cell));
  maps.push(new Wall(10*width_cell, 5*height_cell, 10*width_cell, 7*height_cell));
  maps.push(new Wall(11*width_cell, 5*height_cell, 11*width_cell, 7*height_cell));
  maps.push(new Wall(12*width_cell, 4*height_cell, 12*width_cell, 6*height_cell));
  maps.push(new Wall(12*width_cell, 4*height_cell, 13*width_cell, 4*height_cell));
  maps.push(new Wall(13*width_cell, 4*height_cell, 13*width_cell, 7*height_cell));
  maps.push(new Wall(2*width_cell, 2*height_cell, 4*width_cell, 2*height_cell));
  maps.push(new Wall(3*width_cell, height_cell, 3*width_cell, 2*height_cell));
  maps.push(new Wall(3*width_cell, 3*height_cell, 5*width_cell, 3*height_cell));
  maps.push(new Wall(5*width_cell, 3*height_cell, 5*width_cell, height_cell));
  maps.push(new Wall(6*width_cell, 2*height_cell, 7*width_cell, 2*height_cell));
  maps.push(new Wall(7*width_cell, 2*height_cell, 7*width_cell, 3*height_cell));
  maps.push(new Wall(6*width_cell, 3*height_cell, 11*width_cell, 3*height_cell));
  maps.push(new Wall(9*width_cell, 3*height_cell, 9*width_cell, 4*height_cell));
  maps.push(new Wall(9*width_cell, 4*height_cell, 10*width_cell, 4*height_cell));
  maps.push(new Wall(11*width_cell, 3*height_cell, 11*width_cell, 4*height_cell));
  maps.push(new Wall(10*width_cell, 2*height_cell, 12*width_cell, 2*height_cell));
  maps.push(new Wall(12*width_cell, 3*height_cell, 13*width_cell, 3*height_cell));
  maps.push(new Wall(13*width_cell, 3*height_cell, 13*width_cell, 2*height_cell));

    $('#login-form').submit(function() {
        tankname = $('#login-form input[name="tankname"]').val().trim();
        tankcolor = _COLORS[Math.floor((Math.random() * 11) + 0)];
        tankXPos = Math.floor((Math.random() * _gameArea.width) + 1);
        tankYPos = Math.floor((Math.random() * _gameArea.height) + 1);
        tank = new Tank(tankname, tankcolor, tankXPos, tankYPos, 0);

        _loginPage.fadeOut();
        _gamePage.show();
        socket.emit('add tank', tank);
        return false;
    });

    document.onkeydown = function(event) {
        if (event.keyCode === 68) //d
            socket.emit('keyPress', {
            inputId: 'right',
            state: true
        });
        else if (event.keyCode === 83) //s
            socket.emit('keyPress', {
            inputId: 'down',
            state: true
        });
        else if (event.keyCode === 65) //a
            socket.emit('keyPress', {
            inputId: 'left',
            state: true
        });
        else if (event.keyCode === 87) // w
            socket.emit('keyPress', {
            inputId: 'up',
            state: true
        });

    }
    document.onkeyup = function(event) {
        if (event.keyCode === 68) //d
            socket.emit('keyPress', {
            inputId: 'right',
            state: false
        });
        else if (event.keyCode === 83) //s
            socket.emit('keyPress', {
            inputId: 'down',
            state: false
        });
        else if (event.keyCode === 65) //a
            socket.emit('keyPress', {
            inputId: 'left',
            state: false
        });
        else if (event.keyCode === 87) // w
            socket.emit('keyPress', {
            inputId: 'up',
            state: false
        });
    }
    document.onmousedown = function(event) {
        if (event.button == 0) {
            socket.emit('keyPress', {
                inputId: 'attack',
                state: true
            });
        }
    }
    document.onmouseup = function(event) {
        socket.emit('keyPress', {
            inputId: 'attack',
            state: false
        });
    }
    document.onmousemove = function(event) {
        socket.emit('mouseMove', {
            x: event.pageX,
            y: event.pageY
        });
    }


    function drawWorld() {
        maps.forEach(function(item, index) {
            item.lineDraw(ctx);
        });
    }

    socket.on('newPositions', function(data) {
        ctx.clearRect(0, 0, _gameArea.width, _gameArea.height);
        drawWorld();
        for (var i = 0; i < data.tank.length; i++) {
            (new Tank(data.tank[i].name, data.tank[i].color, data.tank[i].x, data.tank[i].y, data.tank[i].angle)).draw(ctx);
        }

        for (var i = 0; i < data.bullet.length; i++)
            (new Bullet(data.bullet[i].x, data.bullet[i].y, data.bullet[i].angle)).draw(ctx);
    });

});
