const gameModeDiv = document.getElementById("mode");
const vsPlayer = document.getElementById("vsPlayer");
const vsAI = document.getElementById("vsAI");
const gameDiv = document.getElementById("game");
const winner = document.getElementById("winner");
const resetBtn = document.getElementById("game-reset");

const choices = document.querySelectorAll(".choice");

const you = document.getElementById("your-name");
const p1 = document.getElementById("player-one");
const p2 = document.getElementById("player-two");

const singlePlayerNameInput = document.getElementById("chooseName-vsAI");
const multiPlayerNameInput = document.getElementById("chooseName-vsPlayer");

const yourName = document.getElementById("single-yourName");
const p1NameInput = document.getElementById("multi-one-name");
const p2NameInput = document.getElementById("multi-two-name");

const enterGameButtons = document.querySelectorAll(".enter-game");

const winConditions = [
  [0, 1, 2],
  [0, 4, 8],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
  [3, 4, 5],
];

let currentMode = "";
let players = [];
let currentPlayer = "";
let flag = true;
let gameIsOver = false;
let clickCount = 0;

function Player(name, marker) {
  this.name = name;
  this.marker = marker;
  this.nums = [];
}

vsPlayer.addEventListener("click", () => {
  chooseNames("multiPlayer");
});

vsAI.addEventListener("click", () => {
  chooseNames("singlePlayer");
});

function chooseNames(gameMode) {
  gameModeDiv.style.display = "none";

  if (gameMode === "singlePlayer") {
    singlePlayerNameInput.style.display = "flex";
    currentMode = "single";
  }

  if (gameMode === "multiPlayer") {
    multiPlayerNameInput.style.display = "flex";
    currentMode = "multi";
  }
}

enterGameButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentMode === "single") {
      if (yourName.value === "") return;

      you.innerHTML = "Player : " + yourName.value;
      you.style.display = "block";

      let firstPlayer = new Player(yourName.value, "X");
      let secondPlayer = new Player("AI", "O");

      enterTheGame(firstPlayer, secondPlayer);
    }

    if (currentMode === "multi") {
      if (p1NameInput.value === "") return;
      if (p2NameInput.value === "") return;

      p1.innerHTML = "Player one : " + p1NameInput.value;
      p2.innerHTML = "Player two : " + p2NameInput.value;

      p1.style.display = "block";
      p2.style.display = "block";

      let firstPlayer = new Player(p1NameInput.value, "X");
      let secondPlayer = new Player(p2NameInput.value, "O");

      enterTheGame(firstPlayer, secondPlayer);
    }
  });
});

function enterTheGame(firstPlayer, secondPlayer) {
  singlePlayerNameInput.style.display = "none";
  multiPlayerNameInput.style.display = "none";
  gameDiv.style.display = "flex";
  players.push(firstPlayer, secondPlayer);
  getCurrentPlayer(players);
}

function getCurrentPlayer(players) {
  if (flag) currentPlayer = players[0];
  if (!flag) currentPlayer = players[1];
}

choices.forEach((chocie) => {
  chocie.addEventListener(
    "click",
    () => {
      if (gameIsOver) return;

      if (currentMode === "multi") {
        getCurrentPlayer(players);
        hoverEffect(this, currentPlayer.marker);
        chocie.id = currentPlayer.marker;
        chocie.innerHTML = currentPlayer.marker;
        currentPlayer.nums.push(chocie.id);
        flag = !flag;
        clickCount++;

        if (gameOver(currentPlayer.marker)) {
          winner.innerHTML = `Winner is ${currentPlayer.name}`;
          gameIsOver = true;
        }
      }

      if (currentMode === "single") {
        getCurrentPlayer(players);
        chocie.id = currentPlayer.marker;
        chocie.innerHTML = currentPlayer.marker;
        currentPlayer.nums.push(chocie.id);
        flag = !flag;
        clickCount++;

        if (gameOver(currentPlayer.marker)) {
          winner.innerHTML = `Winner is ${currentPlayer.name}`;
          gameIsOver = true;
        }

        setTimeout(() => {
          if (!gameIsOver) {
            getCurrentPlayer(players);
            fillRandom(currentPlayer.marker);
            flag = !flag;
            clickCount++;
          }

          if (gameOver(currentPlayer.marker)) {
            winner.innerHTML = `Winner is ${currentPlayer.name}`;
            gameIsOver = true;
          }
        }, 1000);
      }

      if (clickCount === 9 && !gameIsOver) {
        setTimeout(() => {
          alert("DRAW!");
        }, 1000);
      }
    },
    { once: true }
  );
});

function hoverEffect(target, marker) {
  target.addEventListener("mouseover", () => {
    console.log("hover");
  });
}

function gameOver(marker) {
  return winConditions.some((comb) => {
    return comb.every((index) => {
      return choices[index].id === marker;
    });
  });
}

resetBtn.addEventListener("click", () => {
  window.location.reload();
});

function getRandomNumber() {
  return Math.floor(Math.random() * 9);
}

function fillRandom(marker) {
  let n = getRandomNumber();
  if (choices[n].innerHTML !== "") {
    if (!allChoicesOccupied()) {
      let m = marker;
      fillRandom(m);
    }
  } else {
    choices[n].innerHTML = marker;
    choices[n].id = marker;
    currentPlayer.nums.push(n);
  }
}

function allChoicesOccupied() {
  let allOcupied = true;
  choices.forEach((c) => {
    if (c.innerHTML === "") allOcupied = false;
  });
  return allOcupied;
}
