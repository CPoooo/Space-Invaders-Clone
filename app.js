const grid = document.querySelector(".grid");
const resultsDisplay = document.querySelector(".results");
const width = 15;
const aliensRemoved = [];
let currentShooterIndex = 202;
let invadersId;
let isGoingRight = true;
let direction = 1;
let moveDown = false;
let results = 0;

for (let i = 0; i < width * width; i++) {
  const square = document.createElement("div");
  grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));
console.log(squares);

const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39,
];

function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (!aliensRemoved.includes(i) && alienInvaders[i] < squares.length) {
      squares[alienInvaders[i]].classList.add("invader");
    }
  }
}

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] < squares.length) {
      squares[alienInvaders[i]].classList.remove("invader");
    }
  }
}

draw();
squares[currentShooterIndex].classList.add("shooter");

function moveShooter(e) {
  squares[currentShooterIndex].classList.remove("shooter");
  switch (e.key) {
    case "ArrowLeft":
      if (currentShooterIndex % width !== 0) currentShooterIndex--;
      break;
    case "ArrowRight":
      if (currentShooterIndex % width < width - 1) currentShooterIndex++;
      break;
  }
  squares[currentShooterIndex].classList.add("shooter");
}

document.addEventListener("keydown", moveShooter);

function moveInvaders() {
  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] % width === width - 1;

  remove();

  if (rightEdge && isGoingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width;
    }
    direction = -1;
    isGoingRight = false;
    moveDown = true;
  } else if (leftEdge && !isGoingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width;
    }
    direction = 1;
    isGoingRight = true;
    moveDown = true;
  } else if (!moveDown) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += direction;
    }
  }

  moveDown = false;
  draw();

  if (squares[currentShooterIndex].classList.contains("invader")) {
    resultsDisplay.innerHTML = "GAME OVER";
    clearInterval(invadersId);
  }

  if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = "YOU WIN";
  }
}

invadersId = setInterval(moveInvaders, 600);

function shoot(e) {
  let laserID;
  let currentLaserIndex = currentShooterIndex;

  function moveLaser() {
    squares[currentLaserIndex].classList.remove("laser");
    currentLaserIndex -= width;
    if (currentLaserIndex >= 0) {
      squares[currentLaserIndex].classList.add("laser");

      if (squares[currentLaserIndex].classList.contains("invader")) {
        squares[currentLaserIndex].classList.remove("laser");
        squares[currentLaserIndex].classList.remove("invader");
        squares[currentLaserIndex].classList.add("boom");

        setTimeout(
          () => squares[currentLaserIndex].classList.remove("boom"),
          300
        );
        clearInterval(laserID);

        const alienRemovedIndex = alienInvaders.indexOf(currentLaserIndex);
        aliensRemoved.push(alienRemovedIndex);
        results++;
        resultsDisplay.innerHTML = results;
      }
    }
  }

  if (e.key === "ArrowUp") {
    laserID = setInterval(moveLaser, 100);
  }
}

document.addEventListener("keydown", shoot);
