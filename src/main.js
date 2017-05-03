const BALL_RADIUS = 20,
    PADDLE_HEIGHT = 15,
    PADDLE_WIDTH = 200, 
    BRICK_WIDTH = 140,
    BRICK_HEIGHT = 40,
    BRICK_PADDING = 10,
    BRICK_OFFSET_TOP = 30,
    BRICK_OFFSET_LEFT = 30,
    BRICK_ROW_COUNT = 3,
    BRICK_COLUMN_COUNT = 6;

let canvas = document.getElementById("game-region"),
    ctx = canvas.getContext("2d"),
    // center of the ball, initial location of the ball
    x = canvas.width/2,
    y = canvas.height - 60,
    // ball moving speed
    dx = 4,
    dy = -4,
    // paddle starting x position
    paddleX = (canvas.width - PADDLE_WIDTH) / 2,
    // handle keyboard press, used for paddle moving
    rightPressed = false,
    leftPressed = false,
    score = 0,
    lives = 3;

// initiate bricks 2D array 
let bricks = [];
for (let col = 0; col < BRICK_COLUMN_COUNT; col++) {
    // each brick column has 1 brick row
    bricks[col] = [];
    for (let row = 0; row < BRICK_ROW_COUNT; row++) {
        // each brick row contains a brick cell, with inital x, y
        bricks[col][row] = { x: 0, y: 0, status: 1 };
    }
}

function drawBricks() {
    "use strict";
    let brickX = 0,
        brickY = 0;
    for (let col = 0; col < BRICK_COLUMN_COUNT; col++) {
        for (let row = 0; row < BRICK_ROW_COUNT; row++) {
            // determine the new brick x, y coord
            if (bricks[col][row].status === 1) {
                brickX = (col * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
                brickY = (row * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;
                bricks[col][row].x = brickX;
                bricks[col][row].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}



function drawBall() {
    "use strict";
    ctx.beginPath();
    ctx.arc(x, y, BALL_RADIUS, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}


function drawPaddle() {
    "use strict";
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    "use strict";
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    "use strict";
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function collisionDetection() {
    // Do collision detection by calculating if the center of the ball is inside
    // any brick, for every frame.
    "use strict";
    let b;

    for (let col = 0; col < BRICK_COLUMN_COUNT; col++) {
        for (let row = 0; row < BRICK_ROW_COUNT; row++) {
            b = bricks[col][row];
            // if ball's center is inside any brick
            if (x > b.x && x < b.x + BRICK_WIDTH && 
                y > b.y && y < b.y + BRICK_HEIGHT && b.status === 1) {
                dy = -dy;
                b.status = 0;
                score++;
                if (score === BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) {
                    alert("You win, congratulations!");
                }
            }
        }
    }
}


// handle keyboard arrows
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
// handle mouse movement
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    "use strict";
    if (e.keyCode === 39) {
        rightPressed = true;
    } else if (e.keyCode === 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    "use strict";
    if (e.keyCode === 39) {
        rightPressed = false;
    } else if (e.keyCode === 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    "use strict";
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - PADDLE_WIDTH/2;
    }
}

// main draw function, called once every 5ms.
function draw() {
    "use strict";
    // clear the canvas at the start of each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();

    collisionDetection();

    // bounce the ball left and right
    if ((x + dx > canvas.width - BALL_RADIUS) || (x + dx < BALL_RADIUS)) {
        // keep the y direction going, but reverse the x direction
        dx = -dx;
    }

    // bounce ball on top
    if (y + dy < BALL_RADIUS) {
        dy = -dy;
    } else if (y + dy > canvas.height - BALL_RADIUS) {
        // when ball hits bottom, determine if the ball's x coord is within paddle's 
        // left and right X. 
        if (x > paddleX && x < paddleX + PADDLE_WIDTH) {
            // if yes, bounce it up again.
            dy = -dy;
        } else {
            // life
            lives--;
            if (!lives) {
                alert("GAME OVER");
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 4;
                dy = -4;
                paddleX = (canvas.width - PADDLE_WIDTH) / 2;
            }
        }

    }

    // movement and collision detection for pedal (horizontally)
    if (rightPressed && paddleX < canvas.width-PADDLE_WIDTH) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

draw();