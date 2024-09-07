//declares important variables
var playerCharacter;
var obstacles;
var color;

//creates and initializes the canvas
var gameCanvas = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 700;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        //listens for when keys are pressed, used to control the player's movement
        window.addEventListener('keydown', function (e) {
            gameCanvas.keys = (gameCanvas.keys || []);
            gameCanvas.keys[e.keyCode] = (e.type == "keydown");
            playerCharacter.touching = false;
            e.preventDefault();
        })
        window.addEventListener('keyup', function (e) {
            gameCanvas.keys[e.keyCode] = (e.type == "keydown");
            playerCharacter.released = true;
        })
    },
    stop: function() {
        clearInterval(this.interval);
    },    
    clearCanvas: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

//generates all the components on the canvas on the screen
function startGame() {
    gameCanvas.stop();
    playerCharacter = new Component(30, 30, getColor(), 0, 360);

    obstacles = [
        (new Component(100, 40, "cyan", 100, 440)),
        (new Component(30, 230, "salmon", 550, 340)),
        (new Component(50, 20, "burlywood", 440, 280)),
        (new Component(50, 20, "darkmagenta", 340, 230)),
        (new Component(200, 15, "darkseagreen", 100, 200)),
        (new Component(30, 80, "coral", 150, 120)),
        (new Component(20, 40, "brown", 230, 160)),
        (new Component(60, 20, getColor(), 0, 160, "finish")),
        (new Component(100, 35, "chartreuse", 240, 390)),
        (new Component(50, 20, "aquamarine", 420, 370)),
        (new Component(30, 30, "firebrick", 0, 440)),
        (new Component(100, 45, "green", 100, 300)),
        (new Component(20, 100, "yellow", 300, 300)),
        (new Component(1000, 40, "orange", 0, 470, "lava"))
    ];
    gameCanvas.start();
}

//called when the next level button is clicked; this is just the blueprint/design for level 2
function nextLevel() {
    playerCharacter = new Component(30, 30, getColor(), 0, 360);
    obstacles = [
        (new Component(60, 60, "white", 0, 460)),
        (new Component(20, 30, "white", 120, 430)),
        (new Component(20, 30, "white", 250, 400)),
        (new Component(20, 30, "white", 360, 335)),
        (new Component(5, 30, "white", 500, 460)),
        (new Component(20, 30, "white", 600, 400)),
        (new Component(20, 30, "white", 540, 340)),
        (new Component(20, 30, "white", 600, 280)),
        (new Component(20, 30, "white", 540, 220)),
        (new Component(20, 30, "white", 600, 160)),
        (new Component(10, 10, "white", 530, 120)),
        (new Component(10, 10, "white", 420, 80)),
        (new Component(10, 10, "white", 300, 50)),
        (new Component(10, 10, "white", 200, 120)),
        (new Component(60, 20, getColor(), 0, 300, "finish")),
        (new Component(1000, 40, "orange", 0, 470, "lava"))
    ];
}

//getting information from the user regarding the color of the player
function getColor() {
    return document.getElementById('color').value;
}

//constructing the components
function Component(width, height, color, x, y, type) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.gravitySpeed = 3;
    this.gravity = 0;
    this.touching = false;
    this.id = "player";
    this.cantGoUp = false;
    this.released = false;
    this.type = type;

    //drawing each component on the screen
    this.update = function() {
        ctx = gameCanvas.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    //player movement along the x axis
    this.moveX = function(sign) {
    	if(sign > 0) this.x += 3;
        else this.x -= 3;
        this.hitWalls();
    }

    //player movement along the y-axis
    this.moveY = function(sign) {
        this.gravitySpeed = 0;
        if(this.touching) this.released = false;
        if(!this.released) { //checks to see if the player is still moving upwards (holding the up arrow)
            if(this.touching) { //checks to make sure the player is in contact with the ground or the top of an obstacle
                if(!this.cantGoUp) { //checks to make sure the player isn't directly under an obstacle
                    if(sign < 0) this.y -= 6;
                    else if(sign > 0) this.y += 5;
                }
                this.cantGoUp = false;
                this.gravitySpeed = 3;
            }
        }
        this.gravitySpeed = 3;
        this.hitWalls();
    }

    //prohibits the player from hitting the sides of the canvas
    this.hitWalls = function() {
        //hitting the bottom
        var bottom = gameCanvas.canvas.height - this.height;
        if (this.y > bottom) this.y = bottom;
        //hitting right side
        var side = gameCanvas.canvas.width - this.width;
        if(this.x > side) this.x = side;
        //hitting left side
        if(this.x < 0) this.x = 0;
        //hitting top
        if(this.y < 0) this.y = 0;
    }

    //updating the position of the player
    this.newPos = function() {
        this.y += this.gravitySpeed;      
        this.hitWalls();
    }

}

//checking if the player touches an obstacle
function checkCollision(player, obstacle) {
    var pleft = player.x;
    var pright = player.x + player.width;
    var ptop = player.y + player.height;
    var pbottom = player.y;

    var oleft = obstacle.x;
    var oright = obstacle.x + obstacle.width;
    var otop = obstacle.y;
    var obottom = obstacle.y + obstacle.height;

    if(pleft < oright && pleft > oright - 5 && ptop > otop && pbottom < obottom) player.x = oright; //checks if the player touches the right of an obstacle
    else if(pright > oleft && pright < oleft + 5 && ptop > otop && pbottom < obottom) player.x = oleft - player.width; //checks if the player touches the left of an obstacle
    else if(pright > oleft && pleft < oright && ptop > obottom && pbottom <= obottom) player.cantGoUp = true; //checks if the player touches the bottom of an obstacle
    else if(pright > oleft && pleft < oright && pbottom < otop && ptop > otop) { //checks if the player touches the top of an obstacle
        player.y = otop - player.height;
        player.touching = true;
        if(obstacle.type == "lava") {
            player.x = 0;
            player.y = 370;
        } else if(obstacle.type == "finish") {
            ctx.fillStyle = "pink";
            ctx.textAlign = "center";
            ctx.font = "130px Rubik";
            ctx.fillText("YOU WON!!!", gameCanvas.canvas.width / 2, gameCanvas.canvas.height / 2);
            gameCanvas.stop();
        }
    }
    if(player.y == (gameCanvas.canvas.height - player.height)) player.touching = true;
}

//updates the canvas with each arrow key button press 
function updateGameArea() {
    gameCanvas.clearCanvas();
    playerCharacter.update();
    playerCharacter.newPos();

    if(gameCanvas.keys && gameCanvas.keys[37]) playerCharacter.moveX(-1);
    if(gameCanvas.keys && gameCanvas.keys[39]) playerCharacter.moveX(1);
    if(gameCanvas.keys && gameCanvas.keys[38]) playerCharacter.moveY(-1);
    if(gameCanvas.keys && gameCanvas.keys[40]) playerCharacter.moveY(1);
    
    for(var i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
        checkCollision(playerCharacter, obstacles[i]);
    }
}
