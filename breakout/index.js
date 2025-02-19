const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;
const boardWidth = 560;
const boardHeight = 300;
let xDirection = -2;
let yDirection = 2;

const userStart = [230, 10];
let currentPosition = userStart;

const ballStart = [270, 40];
let ballCurrentPosition = ballStart;

let timerId;
let score = 0;

const hitSound = new Audio('hit.mp3');
const winSound = new Audio('win.mp3');
const loseSound = new Audio('lose.mp3');

class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + blockWidth, yAxis];
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
        this.topLeft = [xAxis, yAxis + blockHeight];
    }
}

const blocks = [];
for (let y = 210; y <= 270; y += 30) {
    for (let x = 10; x <= 450; x += 110) {
        blocks.push(new Block(x, y));
    }
}

function addBlocks() {
    blocks.forEach(block => {
        const blockDiv = document.createElement('div');
        blockDiv.classList.add('block');
        blockDiv.style.left = block.bottomLeft[0] + 'px';
        blockDiv.style.bottom = block.bottomLeft[1] + 'px';
        grid.appendChild(blockDiv);
    });
}
addBlocks();

const user = document.createElement('div');
user.classList.add('user');
grid.appendChild(user);
drawUser();

const ball = document.createElement('div');
ball.classList.add('ball');
grid.appendChild(ball);
drawBall();

function moveUser(e) {
    if (e.key === 'ArrowLeft' && currentPosition[0] > 0) {
        currentPosition[0] -= 10;
    } else if (e.key === 'ArrowRight' && currentPosition[0] < (boardWidth - blockWidth)) {
        currentPosition[0] += 10;
    }
    drawUser();
}
document.addEventListener('keydown', moveUser);

function drawUser() {
    user.style.left = currentPosition[0] + 'px';
    user.style.bottom = currentPosition[1] + 'px';
}

function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
    ball.style.transition = 'all 0.03s linear';
}

function moveBall() {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkForCollisions();
}
timerId = setInterval(moveBall, 30);

function checkForCollisions() {
    blocks.forEach((block, i) => {
        if (
            ballCurrentPosition[0] > block.bottomLeft[0] &&
            ballCurrentPosition[0] < block.bottomRight[0] &&
            (ballCurrentPosition[1] + ballDiameter) > block.bottomLeft[1] &&
            ballCurrentPosition[1] < block.topLeft[1]
        ) {
            document.querySelectorAll('.block')[i].classList.add('fade-out');
            setTimeout(() => document.querySelectorAll('.block')[i].remove(), 200);
            blocks.splice(i, 1);
            changeDirection();
            score++;
            scoreDisplay.innerHTML = score;
            hitSound.play();
            if (blocks.length === 0) {
                scoreDisplay.innerHTML = 'You Win!';
                winSound.play();
                clearInterval(timerId);
                document.removeEventListener('keydown', moveUser);
            }
        }
    });

    if (
        ballCurrentPosition[0] >= (boardWidth - ballDiameter) ||
        ballCurrentPosition[0] <= 0 ||
        ballCurrentPosition[1] >= (boardHeight - ballDiameter)
    ) {
        changeDirection();
        hitSound.play();
    }

    if (
        ballCurrentPosition[0] > currentPosition[0] &&
        ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
        ballCurrentPosition[1] > currentPosition[1] &&
        ballCurrentPosition[1] < currentPosition[1] + blockHeight
    ) {
        changeDirection();
        hitSound.play();
    }

    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId);
        scoreDisplay.innerHTML = 'You Lose!';
        loseSound.play();
        document.removeEventListener('keydown', moveUser);
    }
}

function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2;
        return;
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2;
        return;
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2;
        return;
    }
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2;
        return;
    }
}
