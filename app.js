 const gamesBoardContainer = document.querySelector('#gamesboard-container');
 const optionContainer = document.querySelector('.option-container');
 const flipButton = document.querySelector('#flip-button');
 const startButton = document.querySelector('#start-button')
 const infoDisplay = document.querySelector('#info');
 const turnDisplay = document.querySelector('#turn-display');
 

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
flipButton.addEventListener('click', flip);

// CREATING BOARDS

const width = 10;

function createBoard(color, user) {
  const gameBoardContainer = document.createElement('div');
  gameBoardContainer.classList.add('game-board');
  gameBoardContainer.style.backgroundColor = color;
  gameBoardContainer.id = user;

  for (let i = 0; i < width * width; i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.id = i;
    gameBoardContainer.append(block)
  }
  gamesBoardContainer.append(gameBoardContainer);
}

createBoard('yellow', 'player');
createBoard('pink', 'computer');


// SHIPS

class Ship {
  constructor(name, length)
 {
  this.name = name
  this.length = length
 }
}

const destroyer = new Ship('destroyer', 2);
const submarine = new Ship('submarine', 3);
const cruiser = new Ship('cruiser', 3);
const battleship = new Ship('battleship', 4);
const carrier = new Ship('carrier', 5);

const ships = [destroyer, submarine, cruiser, battleship, carrier];
let notDropped;

function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {

  let validStart = isHorizontal ? startIndex <= width * width - ship.length ? startIndex : width * width - ship.length : startIndex <= width * width - width * ship.length ? startIndex : startIndex -ship.length * width + width;
  let shipBlocks = [];


  for (let i = 0; i < ship.length; i++) {
    if (isHorizontal) {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i])

    } else {
      shipBlocks.push(allBoardBlocks[Number(validStart) + i * width])
    }
  }

    let valid;

    if (isHorizontal) {
      shipBlocks.every((_shipBlock, index) => 
        valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)))
    } else {
      shipBlocks.every((_shipBlock, index) => 
        valid = shipBlocks[0].id < 90 + (width * index + 1)
      ) 
    }

    const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'));

    return { shipBlocks, valid, notTaken}
}



function addShipPiece(user, ship, startId) {
  const allBoardBlocks = document.querySelectorAll(`#${user} div`);
  let randomBoolean = Math.random() < 0.5;
  let isHorizontal = user === 'player' ? angle === 0 : randomBoolean;
  let randomStartIndex = Math.floor(Math.random() * width * width);

  let startIndex = startId ? startId : randomStartIndex;

  const {shipBlocks, valid, notTaken} = getValidity(allBoardBlocks, isHorizontal, startIndex, ship);
  
  


    if (valid && notTaken) {

      shipBlocks.forEach(shipBlock => {
        shipBlock.classList.add(ship.name);
        shipBlock.classList.add('taken');
      })
    } else {
      if (user === 'computer') addShipPiece(user, ship, startId)
      if (user === 'player') notDropped = true
    }



};

ships.forEach(ship => addShipPiece('computer', ship));


// DRAG PLAYER SHIPS
let draggedShip;

const optionShips = Array.from(optionContainer.children)
optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart))

const allPlayerBlocks = document.querySelectorAll('#player div');
allPlayerBlocks.forEach(allPlayerBlock => {
  allPlayerBlock.addEventListener('drag', dragOver);
  allPlayerBlock.addEventListener('drop', dropShip);
  

})

function dragStart(e) {
  notDropped = false;
  console.log(e.target);  
}

function dragOver(e) {
  e.preventDefault()
  const ship = ships[draggedShip.id];
  highlightArea(e.target.id, ship)
}

function dropShip(e) {
  const startId = e.target.id;
  const ship = ships[draggedShip.id];
  addShipPiece('player', ship, startId);

  if (!notDropped) {
    draggedShip.remove();
  }
}

// ADD HIGHTLIGHT

function highlightArea(startIndex, ship) {
  const allBoardBlocks = document.querySelectorAll('#player div');
  let isHorizontal = angle === 0;

  const { shipBlocks, valid, notTaken } = getValidity(allBoardBlocks, isHorizontal, startIndex, ship);

  if (valid && notTaken) {
    shipBlocks.forEach(shipBlock => {
      shipBlock.classList.add('hover')
      setTimeout(() => shipBlock.classList.add('hover'), 500)
    })
  }
}

// GAME LOGIC

let gameOver = false;
let playerTurn;

// start game

function startGame() {

  if (optionContainer.children.length != 0) {
    infoDisplay.textContent = 'Place all your pieces first!'
  } else  {
    const allBoardBlocks = document.querySelectorAll('#computer div')
    allBoardBlocks.forEach(block => block.addEventListener('click', handleClick))
  }

}

startButton.addEventListener('click', startGame);

let playerHits = [];
let computerHits = [];

function handleClick(e) {
  if  (!gameOver) {
    if (e.target.classList.contains('taken')) {
      e.target.classList.add('boom');
      infoDisplay.textContent = "You have a hit!";
      let classes = Array.from(e.target.classList);
      classes = classes.filter(className => className !== 'block')
      classes = classes.filter(className => className !== 'boom')
      classes = classes.filter(className => className !== 'taken')
      playerHits.push(...classes);
      //can delete below console.log when game is complete
      console.log('Player Hits')
    }

    if (!e.target.classList.contain('taken')) {
      infoDisplay.textContent = 'Nothing hit!';
      e.target.classList.add('empty');
    }
    playerTurn = false;
    const allBoardBlocks = document.querySelectorAll('#computer div');
    allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true)))
    setTimeout(computerGo, 3000);
  }
}

// computers go function

function computerGo() {
  if (!gameOver) {
    turnDisplay.textContent = 'Computers turn!'
    infoDisplay.textContent = 'The computer is thinking about its next move...';
  }
}

