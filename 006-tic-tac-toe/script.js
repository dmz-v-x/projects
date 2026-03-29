const cells = [...document.querySelectorAll('.cell')];
const statusEl = document.getElementById('status');
const xScoreEl = document.getElementById('xScore');
const oScoreEl = document.getElementById('oScore');
const drawScoreEl = document.getElementById('drawScore');
const newRoundBtn = document.getElementById('newRoundBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');

const WIN_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let board = Array(9).fill('');
let currentPlayer = 'X';
let isGameOver = false;

let scores = {
  X: 0,
  O: 0,
  draw: 0
};

function updateStatus(text) {
  statusEl.textContent = text;
}

function updateScores() {
  xScoreEl.textContent = String(scores.X);
  oScoreEl.textContent = String(scores.O);
  drawScoreEl.textContent = String(scores.draw);
}

function checkWinner(player) {
  for (const combo of WIN_COMBOS) {
    if (combo.every((index) => board[index] === player)) {
      return combo;
    }
  }
  return null;
}

function renderCell(index) {
  const cell = cells[index];
  const value = board[index];

  cell.textContent = value;
  cell.classList.remove('x', 'o');

  if (value === 'X') {
    cell.classList.add('x');
  }
  if (value === 'O') {
    cell.classList.add('o');
  }
}

function handleTurn(index) {
  if (isGameOver || board[index]) {
    return;
  }

  board[index] = currentPlayer;
  renderCell(index);

  const winningCombo = checkWinner(currentPlayer);
  if (winningCombo) {
    isGameOver = true;
    winningCombo.forEach((winIndex) => cells[winIndex].classList.add('win'));
    scores[currentPlayer] += 1;
    updateScores();
    updateStatus(`Player ${currentPlayer} wins!`);
    return;
  }

  const isDraw = board.every((cell) => cell !== '');
  if (isDraw) {
    isGameOver = true;
    scores.draw += 1;
    updateScores();
    updateStatus('Draw game.');
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus(`Player ${currentPlayer}'s turn`);
}

function newRound() {
  board = Array(9).fill('');
  isGameOver = false;
  currentPlayer = 'X';

  cells.forEach((cell) => {
    cell.textContent = '';
    cell.classList.remove('x', 'o', 'win');
  });

  updateStatus("Player X's turn");
}

cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    const index = Number(cell.dataset.index);
    handleTurn(index);
  });
});

newRoundBtn.addEventListener('click', newRound);

resetScoreBtn.addEventListener('click', () => {
  scores = { X: 0, O: 0, draw: 0 };
  updateScores();
  newRound();
});

updateScores();
newRound();
