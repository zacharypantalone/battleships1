 const gamesBoardContainer = document.querySelector('#gamesboard-container');
 const optionContainer = document.querySelector('.option-container');
 const flipButton = document.querySelector('#flip-button');
 

// OPTIONS

let angle = 0;

function flip() {
  const optionShips = Array.from(optionContainer.children)

  // if (angle === 0) {
  //   angle = 90
  // } else {
  //   angle = 0;
  // }

  // TERNARY OPERATOR OPTION //

  angle = angle === 0 ? 90 : 0
  optionShips.forEach(optionShip => optionShip.style.transform = `rotate(${angle}deg)`)
}

// CREATING BOARDS

const width = 10;

function createBoard(color) {
  const gameBoardContainer = document.createElement('div');
  gameBoardContainer.classList.add('game-board');
  gameBoardContainer.style.backgroundColor = color;

  gamesBoardContainer.append(gameBoardContainer);
}

createBoard('yellow');
createBoard('pink');
flipButton.addEventListener('click', flip);