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
_gameArea.width = $(window).width();
_gameArea.height = 630;
var ctx = _gameArea.getContext('2d');
// control tank, bullet
var tank;
var bullets = [];
var keys = [];
var pageX, pageY;
var mouseHold = false;
var lastShootTime = 0;
$(document).ready(function() {
    // get key
    window.addEventListener('keydown', function(e) {
        keys[e.keyCode] = true;
    });
    window.addEventListener('keyup', function(e) {
        keys[e.keyCode] = false;
    });
    window.addEventListener('mousemove', function(e) {
        pageX = e.clientX;
        pageY = e.clientY;
    });
    window.addEventListener('mousedown', function(e) {
        if (e.button == 0) mouseHold = true;
    });
    window.addEventListener('mouseup', function(e) {
        mouseHold = false;
    });

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

    var velX = 0,
        velY = 0,
        friction = 0.98;
    socket.on('draw tank', function(tank) {
        setInterval(gameLoop, 1000/60);
    });

    function gameLoop() {
        var newXPos = tank.xPos,
            newYPos = tank.yPos,
            oldTank = tank;
        if ((keys[37] || keys[65]) && velX > -tank.speed) {
            velX--;
        }
        if ((keys[38] || keys[87]) && velY > -tank.speed) {
            velY--;
        }
        if ((keys[39] || keys[68]) && velX < tank.speed) {
            velX++;
        }
        if ((keys[40] || keys[83]) && velY < tank.speed) {
            velY++;
        }
        // apply some friction to x velocity.
        velX *= friction;
        newXPos += velX;
        // apply some friction to y velocity.
        velY *= friction;
        newYPos += velY;

        var newAngle = Math.atan2(pageY - newYPos, pageX - newXPos);
        tank = new Tank(tank.name, tank.color, newXPos, newYPos, newAngle);

        if (mouseHold) {
            tank.shooting(bullets);
        }
        bullets.forEach(function(bullet, key) {
            bullet.update();
        });

        socket.emit('reload map', {
            oldTank: oldTank,
            tank: tank,
            bullets: bullets,
        });
        bullets = bullets.filter(function(bullet) {
            return bullet.active;
        });
    }

    socket.on('draw map', function(data) {
        (new Tank(data.oldTank.name, data.oldTank.color, data.oldTank.xPos, data.oldTank.yPos, data.oldTank.angle)).clear();
        (new Tank(data.tank.name, data.tank.color, data.tank.xPos, data.tank.yPos, data.tank.angle)).draw();
        data.bullets.forEach(function(item, key) {
            var bullet = new Bullet(item.xPos, item.yPos, item.angle);
            bullet.clear();
            bullet.draw();
            if (!item.active) bullet.clear();
        });
    });

    socket.on('logout', function(data) {
        (new Tank(data.name, data.color, data.xPos, data.yPos, data.angle)).clear();
    });

});
