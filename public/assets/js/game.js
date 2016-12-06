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
    _gamePage = $('.game').hide(),
    _gameOver = $('.game-over').hide();
var _gameArea = document.getElementById('game-area');
_gameArea.width = 1166;
_gameArea.height = 550;
var ctx = _gameArea.getContext('2d');
var logged = false;
var died = false;
var tankId = null;
var countBullet = 0;
var topPlayer = {
    name: 'unkown',
    color: '#333',
    killCount: 0,
    deadCount: 0,
}

// loading audio
var backgroundAudio = [
    '../assets/audio/ChocoboRacingCidsTheme.mp3',
    '../assets/audio/ChocoboRacingBigChocobos.mp3',
    '../assets/audio/ChocoboRacingGoblinsTheme.mp3',
    '../assets/audio/ChocoboRacingIllusionWorld.mp3',
    '../assets/audio/ChocoboRacingMithrilMines.mp3'
]

var gunShotAudio = new Audio('../assets/audio/gunshot.mp3');
gunShotAudio.volume = 0.3;
var tankDiedAudio = new Audio('../assets/audio/die.mp3');
tankDiedAudio.volume = 0.3;

$(document).ready(function() {
    // load audio for game
    var currAudio = new Audio(backgroundAudio[Math.floor((Math.random() * 4))]);
    currAudio.volume = 0.3;
    currAudio.play();
    currAudio.addEventListener('ended', function() {
        this.src = backgroundAudio[Math.floor((Math.random() * 4))];
        this.currentTime = 0;
        this.play();
    }, false);

    // Push map
    var maps = [];
    var height_cell = _gameArea.height / 7;
    var width_cell = _gameArea.width / 14;
    // maps.push(new Wall(width_cell, 0, width_cell, height_cell));
    maps.push(new Wall(2 * width_cell, height_cell, 7 * width_cell, height_cell));
    maps.push(new Wall(8 * width_cell, 0, 8 * width_cell, 2 * height_cell));
    maps.push(new Wall(9 * width_cell, height_cell, 10 * width_cell, height_cell));
    maps.push(new Wall(9 * width_cell, height_cell, 9 * width_cell, 2 * height_cell));
    maps.push(new Wall(11 * width_cell, 0, 11 * width_cell, 2 * height_cell));
    maps.push(new Wall(11 * width_cell, height_cell, 12 * width_cell, height_cell));
    maps.push(new Wall(13 * width_cell, height_cell, 14 * width_cell, height_cell));
    maps.push(new Wall(0, 2 * height_cell, width_cell, 2 * height_cell));
    maps.push(new Wall(width_cell, 2 * height_cell, width_cell, 3 * height_cell));
    maps.push(new Wall(width_cell, 3 * height_cell, 2 * width_cell, 3 * height_cell));
    maps.push(new Wall(width_cell, 4 * height_cell, width_cell, 7 * height_cell));
    maps.push(new Wall(width_cell, 4 * height_cell, 2 * width_cell, 4 * height_cell));
    maps.push(new Wall(width_cell, 5 * height_cell, 3 * width_cell, 5 * height_cell));
    maps.push(new Wall(2 * width_cell, 6 * height_cell, 4 * width_cell, 6 * height_cell));
    maps.push(new Wall(4 * width_cell, 4 * height_cell, 4 * width_cell, 6 * height_cell));
    maps.push(new Wall(3 * width_cell, 4 * height_cell, 6 * width_cell, 4 * height_cell));
    maps.push(new Wall(6 * width_cell, 4 * height_cell, 6 * width_cell, 5 * height_cell));
    maps.push(new Wall(5 * width_cell, 5 * height_cell, 5 * width_cell, 6 * height_cell));
    maps.push(new Wall(5 * width_cell, 6 * height_cell, 8 * width_cell, 6 * height_cell));
    maps.push(new Wall(7 * width_cell, 4 * height_cell, 7 * width_cell, 5 * height_cell));
    maps.push(new Wall(7 * width_cell, 4 * height_cell, 8 * width_cell, 4 * height_cell));
    maps.push(new Wall(8 * width_cell, 4 * height_cell, 8 * width_cell, 7 * height_cell));
    maps.push(new Wall(8 * width_cell, 5 * height_cell, 9 * width_cell, 5 * height_cell));
    maps.push(new Wall(9 * width_cell, 5 * height_cell, 9 * width_cell, 6 * height_cell));
    maps.push(new Wall(10 * width_cell, 5 * height_cell, 10 * width_cell, 7 * height_cell));
    maps.push(new Wall(11 * width_cell, 5 * height_cell, 11 * width_cell, 7 * height_cell));
    maps.push(new Wall(12 * width_cell, 4 * height_cell, 12 * width_cell, 6 * height_cell));
    maps.push(new Wall(12 * width_cell, 4 * height_cell, 13 * width_cell, 4 * height_cell));
    maps.push(new Wall(13 * width_cell, 4 * height_cell, 13 * width_cell, 5 * height_cell));
    maps.push(new Wall(2 * width_cell, 2 * height_cell, 4 * width_cell, 2 * height_cell));
    maps.push(new Wall(3 * width_cell, height_cell, 3 * width_cell, 2 * height_cell));
    maps.push(new Wall(3 * width_cell, 3 * height_cell, 5 * width_cell, 3 * height_cell));
    maps.push(new Wall(5 * width_cell, 3 * height_cell, 5 * width_cell, height_cell));
    maps.push(new Wall(6 * width_cell, 3 * height_cell, 11 * width_cell, 3 * height_cell));
    maps.push(new Wall(9 * width_cell, 3 * height_cell, 9 * width_cell, 4 * height_cell));
    maps.push(new Wall(9 * width_cell, 4 * height_cell, 10 * width_cell, 4 * height_cell));
    maps.push(new Wall(11 * width_cell, 3 * height_cell, 11 * width_cell, 4 * height_cell));
    maps.push(new Wall(10 * width_cell, 2 * height_cell, 12 * width_cell, 2 * height_cell));
    maps.push(new Wall(12 * width_cell, 3 * height_cell, 13 * width_cell, 3 * height_cell));
    maps.push(new Wall(13 * width_cell, 3 * height_cell, 13 * width_cell, 2 * height_cell));

    $('#login-form').submit(function() {
        tankname = $('#login-form input[name="tankname"]').val().trim();
        tankcolor = _COLORS[Math.floor((Math.random() * 11) + 0)];
        tankXPos = Math.floor((Math.random() * (Math.floor((Math.random() * 12))) * width_cell) + 15);
        tankYPos = Math.floor((Math.random() * (Math.floor((Math.random() * 6))) * height_cell) + 15);
        tank = new Tank(tankname, tankcolor, tankXPos, tankYPos, 0);
        currAudio.pause();
        logged = true;
        _loginPage.fadeOut();
        _gamePage.show();
        socket.emit('add tank', tank);
        return false;
    });

    document.onkeydown = function(event) {
        if (event.keyCode === 68 || event.keyCode === 39) //d
            socket.emit('keyPress', {
            inputId: 'right',
            state: true
        });
        else if (event.keyCode === 83 || event.keyCode === 40) //s
            socket.emit('keyPress', {
            inputId: 'down',
            state: true
        });
        else if (event.keyCode === 65 || event.keyCode === 37) //a
            socket.emit('keyPress', {
            inputId: 'left',
            state: true
        });
        else if (event.keyCode === 87 || event.keyCode === 38) // w
            socket.emit('keyPress', {
            inputId: 'up',
            state: true
        });
        // if(died && event.keyCode === 32) {
        //     socket.emit('changeStatus', {
        //         id: tankId,
        //         status: 0
        //     });
        //     _gameOver.hide();
        //     _gamePage.show();
        //     died = false;
        // }
    }
    document.onkeyup = function(event) {
        if (event.keyCode === 68 || event.keyCode === 39) //d
            socket.emit('keyPress', {
            inputId: 'right',
            state: false
        });
        else if (event.keyCode === 83 || event.keyCode === 40) //s
            socket.emit('keyPress', {
            inputId: 'down',
            state: false
        });
        else if (event.keyCode === 65 || event.keyCode === 37) //a
            socket.emit('keyPress', {
            inputId: 'left',
            state: false
        });
        else if (event.keyCode === 87 || event.keyCode === 38) // w
            socket.emit('keyPress', {
            inputId: 'up',
            state: false
        });
        if(died && event.keyCode === 32) {
            socket.emit('changeStatus', {
                id: tankId,
                status: 0
            });
            _gameOver.hide();
            _gamePage.show();
            died = false;
        }
    }

    var playShotAudio;
    document.onmousedown = function(event) {
        if (countBullet < 5 && logged && event.button == 0) {
            socket.emit('keyPress', {
                inputId: 'attack',
                state: true
            });
            playShotAudio = true;
            gunShotAudio.load();
            gunShotAudio.play();
            gunShotAudio.onended = function() {
                this.currentTime = 0;
                if (playShotAudio) this.play();
            };
        }
    }
    document.onmouseup = function(event) {
        socket.emit('keyPress', {
            inputId: 'attack',
            state: false
        });
        playShotAudio = false;
        gunShotAudio.onended = function() {
            this.pause();
            this.currentTime = 0;
        };
        // gunShotAudio.currentTime = 0;
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

    socket.on('tankId', function(data) {
        tankId = data;
    });

    function gameOver() {
        _gamePage.fadeOut();
        _gameOver.show();
        died = true;
    }

    socket.on('newPositions', function(data) {
        ctx.clearRect(0, 0, _gameArea.width, _gameArea.height);
        drawWorld();
        for (var i = 0; i < data.tank.length; i++) {
            if (data.tank[i].status == 0) {
                (new Tank(data.tank[i].name, data.tank[i].color, data.tank[i].x, data.tank[i].y, data.tank[i].angle)).draw(ctx);
            } else if (data.tank[i].status == 1) {
                $('.game-notify .first-mess').html($('.game-notify .second-mess').html());
                $('.game-notify .second-mess').html('<span style="font-weight: bold; color: ' + data.tank[i].color + '">' + data.tank[i].name + '</span> was killed by ' + data.tank[i].killBy);
                // a tank has just died
                tankDiedAudio.play();
                socket.emit('changeStatus', {
                    id: data.tank[i].id,
                    status: 2
                });
            } else if (data.tank[i].status == 2) {
                if (!died && data.tank[i].id == tankId) {
                    gameOver();
                }
            }
            if (data.tank[i].id == tankId) {
                countBullet = data.tank[i].countBullet;
                $('.your-scoreboard #count-bullet').html(countBullet);
                $('.your-scoreboard #kill-score').html(data.tank[i].killCount);
                $('.your-scoreboard #dead-score').html(data.tank[i].deadCount);
                $('.scoreboard #kill-score').html(data.tank[i].killCount);
                $('.scoreboard #dead-score').html(data.tank[i].deadCount);
            }
            if (data.tank[i].killCount > topPlayer.killCount) {
                topPlayer.name = data.tank[i].name;
                topPlayer.color = data.tank[i].color;
                topPlayer.killCount = data.tank[i].killCount;
                topPlayer.deadCount = data.tank[i].deadCount;
            } else if (data.tank[i].killCount == topPlayer.killCount && data.tank[i].deadCount < data.tank[i].deadCount) {
                topPlayer.name = data.tank[i].name;
                topPlayer.color = data.tank[i].color;
                topPlayer.killCount = data.tank[i].killCount;
                topPlayer.deadCount = data.tank[i].deadCount;
            }
        }

        for (var i = 0; i < data.bullet.length; i++)
            (new Bullet(data.bullet[i].x, data.bullet[i].y, data.bullet[i].angle)).draw(ctx);
        $('#top-player').html('<span style="font-weight: bold; color: ' + topPlayer.color + ';">' + topPlayer.name + '</span> (' + topPlayer.killCount + ' kill, ' + topPlayer.deadCount + ' dead)');
        $('#online').html(data.onlinePlayer);
    });

});
