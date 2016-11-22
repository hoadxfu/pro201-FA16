$(document).ready(function() {
    // define
    var _COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];

    // socket
    var socket = io();
    // pages
    var _loginPage = $('.login'),
        _gamePage = $('.game').hide();
    var _gameArea = document.getElementById('game-area');
    _gameArea.width = $(window).width();
    _gameArea.height = 630;
    var ctx = _gameArea.getContext('2d');
    var lastShootTime = 0;

    // Object Bullet
    function Bullet(xPos, yPos, angle) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.angle = angle;
        this.size = 6;
        this.speed = 4;
        this.active = true;
    }
    Bullet.prototype.inBound = function() {
        return this.xPos - this.size >= 0 && this.yPos - this.size >= 0 && this.xPos + this.size <= _gameArea.width && this.yPos + this.size <= _gameArea.width;
    }
    Bullet.prototype.update = function() {
        this.xPos += this.speed * Math.cos(this.angle);
        this.yPos += this.speed * Math.sin(this.angle);
        this.active = this.active && this.inBound();
    }
    Bullet.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.size, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = 'red';
        ctx.fill();
    }
    Bullet.prototype.clear = function() {
        ctx.clearRect(this.xPos - this.size - 5, this.yPos - this.size - 5, this.size * 2 + 10, this.size* 2 + 10);
    }

    // Object Tank
    function Tank(name, color, xPos, yPos, angle) {
        this.name = name;
        this.color = color;
        this.xPos = xPos;
        this.yPos = yPos;
        this.angle = angle;
        this.size = 20;
        this.bulletSize = 6;
        this.speed = 2;
        this.lastShootTime = 0;  // time when we last shoot
        this.shootRate = 300;    // time between two bullets. (in ms)
    }
    Tank.prototype.inBound = function() {
        return this.xPos - this.size >= 0 && this.yPos - this.size >= 0 && this.xPos + this.size <= _gameArea.width && this.yPos + this.size <= _gameArea.width;
    }
    Tank.prototype.clear = function() {
        ctx.save();
        ctx.translate(this.xPos, this.yPos);
        ctx.rotate(this.angle);
        ctx.clearRect(- this.size - 1, - this.size - 1, this.size * 3 + 2, this.size * 2 + 2);
        ctx.restore();
    }
    Tank.prototype.draw = function() {
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
    Tank.prototype.shooting = function() {
        var now = (new Date()).getTime();
        if (now - lastShootTime < this.shootRate) return;
        lastShootTime = now;
        bullets.push(new Bullet(
            this.xPos + (this.size * 2 + 8) * Math.cos(this.angle),
            this.yPos + (this.size * 2 + 8) * Math.sin(this.angle),
            this.angle
        ));
    }

    var tank;
    var bullets = [];
    var keys = [];
    var pageX, pageY;
    var mouseHold = false;
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
        mouseHold = true;
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
        requestAnimationFrame(gameLoop);
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
            tank.shooting();
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
        requestAnimationFrame(gameLoop);
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
