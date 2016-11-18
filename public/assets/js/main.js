// $('form').submit(function() {
//     socket.emit('chat message', $('#m').val());
//     $('#m').val('');
//     return false;
// });
// socket.on('chat message', function(msg){
//     $('#messages').append($('<li>').text(msg));
//  });

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

    var connected = false;
    var username;
    var usercolor;

    function clear(xPos, yPos) {
        ctx.clearRect(xPos - _TANK_SIZE, yPos - _TANK_SIZE, xPos + _TANK_SIZE, yPos + _TANK_SIZE);
    }

    function drawTank(color, xPos, yPos) {
        // Create gradient
        var grd = ctx.createLinearGradient(0, 0, 200, 0);
        grd.addColorStop(0, color);
        grd.addColorStop(1, 'white');

        // Fill with gradient
        ctx.beginPath();
        ctx.arc(xPos, yPos, _TANK_SIZE, 0, 2 * Math.PI);
        ctx.fillStyle = grd;
        ctx.fill();
    }

    $('#login-form').submit(function() {
        username = $('#login-form input[name="username"]').val().trim();
        usercolor = _COLORS[Math.floor((Math.random() * 11) + 0)];
        userXPos = Math.floor((Math.random() * _gameArea.width) + 1);
        userYPos = Math.floor((Math.random() * _gameArea.height) + 1);
        // $(this).reset();
        _loginPage.fadeOut();
        _gamePage.show();
        socket.emit('add user', {
            username: username,
            usercolor: usercolor,
            userXPos: userXPos,
            userYPos: userYPos
        });
        return false;
    });

    socket.on('draw tank', function(data) {
        drawTank(data.usercolor, data.userXPos, data.userYPos);
    });

    $(document).bind('keydown', function(e) {
        if (e.keyCode == 37) {
            drawTank(usercolor, )
        }
        if (e.keyCode == 38) {
            box.animate({
                top: "-=5000"
            }, 3000);
        }
        if (e.keyCode == 39) {
            box.animate({
                left: "+=5000"
            }, 3000);
        }
        if (e.keyCode == 40) {
            box.animate({
                top: "+=5000"
            }, 3000);
        }
    });

    socket.on('logout', function(data) {
        clear(data.userXPos, data.userYPos);
    });

});
