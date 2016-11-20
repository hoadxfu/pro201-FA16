$(document).ready(function() {
    // define
    var _COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];
    var _TANK_SIZE = 15;

    // socket
    var socket = io();
    // pages
    var _loginPage = $('.login'),
        _gamePage = $('.game').hide();
    var _gameArea = document.getElementById('game-area');
    _gameArea.width = $(window).width();
    _gameArea.height = 630;
    var ctx = _gameArea.getContext('2d');

    function User(name, color, xPos, yPos) {
        this.name = name;
        this.color = color;
        this.xPos = xPos;
        this.yPos = yPos;
    }
    var user;
    var keys = [];

    // get key
    window.addEventListener("keydown", function(e) {
        keys[e.keyCode] = true;
    });
    window.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false;
    });

    function clear(xPos, yPos) {
        ctx.clearRect(xPos - _TANK_SIZE - 1, yPos - _TANK_SIZE - 1, _TANK_SIZE * 2 + 2, _TANK_SIZE * 2 + 2);
    }

    function drawTank(color, xPos, yPos) {
        // Fill with gradient
        ctx.beginPath();
        ctx.arc(xPos, yPos, _TANK_SIZE, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    $('#login-form').submit(function() {
        username = $('#login-form input[name="username"]').val().trim();
        usercolor = _COLORS[Math.floor((Math.random() * 11) + 0)];
        userXPos = Math.floor((Math.random() * _gameArea.width) + 1);
        userYPos = Math.floor((Math.random() * _gameArea.height) + 1);
        user = new User(username, usercolor, userXPos, userYPos);

        _loginPage.fadeOut();
        _gamePage.show();
        socket.emit('add user', user);
        return false;
    });

    var maxSpeed = 5,
        velX = 0,
        velY = 0,
        friction = 0.98;
    socket.on('draw tank', function(user) {
        setInterval(gameLoop, 1000/60);
    });

    function gameLoop() {
        var newXPos = user.xPos,
            newYPos = user.yPos,
            oldXPos = user.xPos,
            oldYPos = user.yPos;
        if ((keys[37] || keys[65]) && velX > -maxSpeed) {
            velX--;
        }
        if ((keys[38] || keys[87]) && velY > -maxSpeed) {
            velY--;
        }
        if ((keys[39] || keys[68]) && velX < maxSpeed) {
            velX++;
        }
        if ((keys[40] || keys[83]) && velY < maxSpeed) {
            velY++;
        }
        // apply some friction to x velocity.
        velX *= friction;
        newXPos += velX;
        // apply some friction to y velocity.
        velY *= friction;
        newYPos += velY;

        user = new User(user.name, user.color, newXPos, newYPos);
        socket.emit('reload map', {
            oldXPos: oldXPos,
            oldYPos: oldYPos,
            user: user,
        });
    }

    socket.on('draw map', function(data) {
        clear(data.oldXPos, data.oldYPos);
        drawTank(data.user.color, data.user.xPos, data.user.yPos);
    });

    socket.on('logout', function(data) {
        console.log(data);
        clear(data.xPos, data.yPos);
    });

});
