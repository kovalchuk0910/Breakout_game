const canvas = document.querySelector('#canvas');
const context = canvas.getContext("2d");
const scoreSpan = document.querySelector('#scoreSpan');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

let score = 0;

const player = {
    x: 270,
    y: 360,
    w: 70,
    h: 15,
    dx: 5,
}

const ball = {
    x: 305,
    y: 350,
    radius: 7,
    dx: 4,
    dy: 9,
}

const bricks = {
    rows: 7,
    cols: 4,
}

const brick = {
    w: 65, 
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true,
}

let bricksLength = bricks.rows * bricks.cols;
const bricksArr = [];

for (let i = 0; i < bricks.rows; i++) {
    bricksArr[i] = [];
    for (let j = 0; j < bricks.cols; j++) {
      const x = i * (brick.w + brick.padding) + brick.offsetX;
      const y = j * (brick.h + brick.padding) + brick.offsetY;
      bricksArr[i][j] = {
        x,
        y,
        ...brick
      };
    }
  }

function game() {
    update();
    render();
    requestAnimationFrame(game);
}
requestAnimationFrame(game);


function renderPlayer() {
    context.beginPath();

    context.rect(player.x, player.y, player.w, player.h);

    context.fillStyle = "black";
    context.fill();
    context.closePath();
}

function renderBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    context.fillStyle = "black";
    context.fill();
    context.closePath();
}

function renderBricks() {
    bricksArr.forEach((col) => {
        col.forEach((brick) => {
          context.beginPath();

          context.rect(brick.x, brick.y, brick.w, brick.h);
          context.fillStyle = brick.visible ? "#C21A70" : "transparent";
          context.fill();

          context.closePath();
        });
      });
}

let playerDiraction = "";


//------------------Player Move---------------------

document.addEventListener('keydown', (e) => {
    if(e.keyCode === 65) {
        playerDiraction = "left";
    } else if(e.keyCode === 68) {
        playerDiraction = "right";
    }
})

document.addEventListener('keyup', (e) => {
    if(e.keyCode === 65) {
        playerDiraction = " ";
    } else if(e.keyCode === 68) {
        playerDiraction = " ";
    }
})

function movePlayer() {
    if(playerDiraction === "left") player.x -= player.dx; 
    if(playerDiraction === "right") player.x += player.dx;

    if(player.x <= 0) player.x = 0
    if(player.x >= 600 - 70) player.x = 600 - 70;
}

//------------------Ball Move---------------------

function moveBall() {
    ball.x += ball.dx;
    ball.y -= ball.dy;

    if(ball.x + 7 >= 600 || ball.x <= 7) ball.dx = -ball.dx;
    if(ball.y <= 0 || ball.y + 7 >= 400) ball.dy = -ball.dy;
    
    if(ball.x + ball.radius > player.x 
        && ball.x <= player.x + player.w
        && ball.y + ball.radius >= player.y) {
            ball.dy = -ball.dy;
        }

    bricksArr.forEach((col) => {
        col.forEach((brick) => {
            if (brick.visible === true) {
                checkBricksCollision(brick);
            }
        });
    });
        
}

function checkBricksCollision(brick) {
    if (ball.x >= brick.x 
        && ball.x + ball.radius <= brick.x + brick.w 
        && ball.y + ball.radius >= brick.y 
        && ball.y <= brick.y + brick.h) {
            ball.dy = -ball.dy;
            brick.visible = false;

            bricksLength--;
            updateScore();
        }
}

function checkWin() {
    if(bricksLength <= 0) {
        alert("You Won");
        bricksLength = 1;
        location.reload();
    }
}

function checkLoose() {
    if(ball.y + ball.radius >= 400) {
        location.reload();
    }
}

function updateScore() {
    scoreSpan.innerHTML = "";
    score++;
    scoreSpan.innerHTML = score;
}


function update() {
    movePlayer();
    moveBall();
    checkWin();
    checkLoose();
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    renderPlayer();
    renderBall();
    renderBricks();
}