// 1. Words Dictionary

const WORDS = [
  'apple', 'beach', 'chair', 'dream', 'eagle', 'flame', 'grape', 'house',
  'jolly', 'knife', 'lemon', 'magic', 'night', 'ocean', 'pride', 'queen',
  'river', 'smile', 'tiger', 'unity', 'vital', 'whale', 'youth', 'zebra'
];

// 2. Rows and Columns for input

const ROWS = 6;
const COLS = 5;

// 3. Getting necessary detail from html scaffold.

const board = document.getElementById('board');
const keyboard = document.getElementById('keyboard');
const message = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');

let secretWord = ''; // correct answer
let currentRow = 0; // current row
let currentCol = 0; // current column
let gusses = []; // current gusses
let gameover = false; // game status

// 4. Random Word that is our correct answer
function pickWord(){
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}

// 5. Creating the board for input
function createBoard(){
    board.innerHTML = '';
    for(let r = 0; r<ROWS; r++){
        const row = document.createElement('div');
        row.className = 'row';
        for(let c = 0; c<COLS; c++){
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = `tile-${r}-${c}`;
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
}

// 6. Creating keyboard
function createKeyboard(){
    const rows = ['qwertyuiop', 'asdfghjkl', 'enterzxcvbnmback'];
    keyboard.innerHTML = '';
    rows.forEach((rowkeys) => {
        const row = document.createElement('div');
        row.className = 'key-row';

        let i = 0;
        while(i < rowkeys.length){
            if(rowkeys.startsWith('enter', i)){
                const key = buildKey('enter', 'Enter', true);
                row.appendChild(key);
                i += 5;
            }else if(rowkeys.startsWith('back', i)){
                const key = buildKey('backspace', 'Del', true);
                row.appendChild(key);
                i += 4;
            }else {
                const letter = rowKeys[i];
                row.appendChild(buildKey(letter, letter, false));
                i += 1;
            }
        }
        keyboard.appendChild(row);
    })
}

// 7. Building Keys (Which are buttons)

function buildKey(value, label, isLarge){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `key${isLarge ? ' large' : ''}`
    btn.dataset.key = value;
    btn.textContent = label;
    return btn;
}

// 8. Function to get tile

function getTile(row, col){
    return document.getElementById(`tile-${row}-${col}`);
}

// 9. Setting Message after game completion

function setMessage(text){
    message.textContent = text;
}

// 10. Adding letter to tile

function addLetter(letter) {
  if (gameOver || currentCol >= COLS) {
    return;
  }

  guesses[currentRow][currentCol] = letter;
  const tile = getTile(currentRow, currentCol);
  tile.textContent = letter;
  tile.classList.add('filled');
  currentCol += 1;
}

function removeLetter() {
  if (gameOver || currentCol === 0) {
    return;
  }

  currentCol -= 1;
  guesses[currentRow][currentCol] = '';
  const tile = getTile(currentRow, currentCol);
  tile.textContent = '';
  tile.classList.remove('filled');
}

function evaluateGuess(guess) {
  const result = Array(COLS).fill('absent');
  const secretChars = secretWord.split('');

  for (let i = 0; i < COLS; i += 1) {
    if (guess[i] === secretChars[i]) {
      result[i] = 'correct';
      secretChars[i] = null;
    }
  }

  for (let i = 0; i < COLS; i += 1) {
    if (result[i] !== 'correct') {
      const foundIndex = secretChars.indexOf(guess[i]);
      if (foundIndex !== -1) {
        result[i] = 'present';
        secretChars[foundIndex] = null;
      }
    }
  }

  return result;
}

function updateKeyboard(letter, state) {
  const key = keyboard.querySelector(`[data-key="${letter}"]`);
  if (!key) {
    return;
  }

  if (key.classList.contains('correct')) {
    return;
  }

  if (key.classList.contains('present') && state === 'absent') {
    return;
  }

  key.classList.remove('correct', 'present', 'absent');
  key.classList.add(state);
}

function submitGuess() {
  if (gameOver) {
    return;
  }

  if (currentCol < COLS) {
    setMessage('Word must be 5 letters.');
    return;
  }

  const guess = guesses[currentRow].join('');
  if (!/^[a-z]{5}$/.test(guess)) {
    setMessage('Use only 5 letters (A-Z).');
    return;
  }

  const states = evaluateGuess(guess);

  for (let c = 0; c < COLS; c += 1) {
    const tile = getTile(currentRow, c);
    tile.classList.add(states[c]);
    updateKeyboard(guess[c], states[c]);
  }

  if (guess === secretWord) {
    gameOver = true;
    setMessage('Great! You guessed it.');
    return;
  }

  if (currentRow === ROWS - 1) {
    gameOver = true;
    setMessage(`Game over. Word was ${secretWord.toUpperCase()}.`);
    return;
  }

  currentRow += 1;
  currentCol = 0;
  setMessage('Keep going.');
}

function handleKey(key) {
  if (key === 'enter') {
    submitGuess();
    return;
  }

  if (key === 'backspace') {
    removeLetter();
    return;
  }

  if (/^[a-z]$/.test(key)) {
    addLetter(key);
  }
}

function initGame() {
  secretWord = pickWord();
  currentRow = 0;
  currentCol = 0;
  gameOver = false;
  guesses = Array.from({ length: ROWS }, () => Array(COLS).fill(''));
  createBoard();
  createKeyboard();
  setMessage('Type a word and press Enter.');
}

keyboard.addEventListener('click', (event) => {
  const key = event.target.closest('.key');
  if (!key) {
    return;
  }
  handleKey(key.dataset.key);
});

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'enter' || key === 'backspace' || /^[a-z]$/.test(key)) {
    handleKey(key);
  }
});

resetBtn.addEventListener('click', initGame);

initGame();