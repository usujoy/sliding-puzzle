class Game {
  #numbers;
  constructor() {
    // this.#numbers = this.#range(0, to);
  }

  #winningPositions = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    "",
  ];

  #range(from, to) {
    const numbers = [];
    for (let i = from; i < to; i++) {
      numbers.push(i);
    }

    return numbers;
  }

  #DIRECTIONS = [-5, 5, -1, 1];

  #shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  #areEqual(array1, array2) {
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }

    return true;
  }

  shuffleNumbers(puzzle) {
    let emptyPos = puzzle.indexOf(0);

    for (let i = 0; i < 1000; i++) {
      const directions = [...this.#DIRECTIONS];
      this.#shuffleArray(directions);

      for (let move of directions) {
        let newPos = emptyPos + move;

        if (newPos >= 0 && newPos < puzzle.length) {
          if (
            (move === -1 && emptyPos % 5 === 0) ||
            (move === 1 && emptyPos % 5 === 2)
          ) {
            continue;
          }

          [puzzle[emptyPos], puzzle[newPos]] = [
            puzzle[newPos],
            puzzle[emptyPos],
          ];
          emptyPos = newPos;
          break;
        }
      }
    }

    const indexOfZero = puzzle.indexOf(0);

    puzzle.splice(indexOfZero, 1, "");
    return puzzle;
  }

  updateGamePad(shuffledNumbers) {
    for (let index = 0; index < shuffledNumbers.length; index++) {
      const tile = document.getElementById(index);

      tile.textContent = shuffledNumbers[index];

      if (tile.textContent === "") tile.classList.add("empty-tile");
      else tile.classList.remove("empty-tile");
    }
  }

  changePositions(currentPositions, currentTile) {
    const numbersPosition = [...currentPositions];
    const emptySpace = numbersPosition.indexOf("");

    numbersPosition[emptySpace] = numbersPosition[currentTile];
    numbersPosition[currentTile] = "";

    return numbersPosition;
  }

  isEmptyTile(tileNumber) {
    const moves = {
      1: [1, -1, 5, -5],
      2: [1, -1, 5, -5],
      3: [1, -1, 5, -5],
      4: [-1, 5, -5],
      0: [1, -5, 5],
    };

    const currentPosition = tileNumber;

    const possibleMoves = moves[currentPosition % 5];

    const validMoves = possibleMoves.filter((x) => {
      const num = currentPosition + x;
      return num >= 0 && num <= 24;
    });

    return validMoves.some(
      (x) => document.getElementById(currentPosition + x).textContent === ""
    );
  }

  hasWon(currentPositions) {
    return this.#areEqual(currentPositions, this.#winningPositions);
  }

  winningMessage() {
    const winMessage = document.querySelector(".winner");

    winMessage.classList.add("show");
  }
}

const gameLoad = () => {
  const game = new Game();
  const numbers = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 0,
  ];
  let puzzle = game.shuffleNumbers(numbers);

  const gamePad = document.querySelector(".main-box");
  const restart = document.querySelector("button");

  game.updateGamePad(puzzle);

  gamePad.addEventListener("click", () => {
    const tile = +event.target.id;

    if (game.isEmptyTile(tile)) {
      const latestPositions = game.changePositions(puzzle, tile);
      game.updateGamePad(latestPositions);
      puzzle = latestPositions;
    }

    if (game.hasWon(puzzle)) {
      game.winningMessage();
    }
  });

  restart.addEventListener("click", () => {
    window.location.reload();
  });
};

window.onload = gameLoad;
