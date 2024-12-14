const WORD = 'LOOOP';
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

let currentRow = 0;
let currentCell = 0;
let gameActive = false;

let timeLeft = 60;
let timerId = null;
const timerElement = document.querySelector('.timer span');

const timerContainer = document.querySelector('.timer');
timerContainer.style.display = 'none';

const startButton = document.querySelector('button');
const rows = document.querySelectorAll('.row');

document.querySelectorAll('.cell').forEach(cell => {
    cell.removeAttribute('readonly');
});

startButton.addEventListener('click', () => {
    resetGame();
    
    timerContainer.style.display = 'block';
    startTimer();
    
    gameActive = true;
    startButton.disabled = true;
    
    Array.from(rows[0].children).forEach(cell => {
        cell.removeAttribute('disabled');
    });
    
    rows[0].children[0].focus();
});

function startTimer() {
    timeLeft = 60;
    updateTimerDisplay();
    
    timerId = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            endGame('Tempo esgotado!');
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerElement.textContent = `${timeLeft}s`;
}

function resetGame() {
    if (timerId) clearInterval(timerId);
    
    timerContainer.style.display = 'none';
    timeLeft = 60;
    updateTimerDisplay();
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.value = '';
        cell.style.border = '2px solid #ccc';
        cell.setAttribute('disabled', true);
    });
    
    currentRow = 0;
    currentCell = 0;
    gameActive = false;
    startButton.disabled = false;
}

function endGame(message) {
    clearInterval(timerId);
    gameActive = false;
    
    timerContainer.style.display = 'none';
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.setAttribute('disabled', true);
    });
    
    alert(message);
    resetGame();
}

document.querySelectorAll('.cell').forEach((cell, index) => {
    cell.addEventListener('input', (e) => {
        if (!gameActive) return;

        let value = e.target.value.toUpperCase();
        if (!/^[A-Z]$/.test(value)) {
            e.target.value = '';
            return;
        }

        e.target.value = value;

        const currentRowCells = Array.from(rows[currentRow].children);
        const currentPos = currentRowCells.indexOf(e.target);
        if (currentPos < WORD_LENGTH - 1) {
            currentRowCells[currentPos + 1].focus();
        }
    });

    cell.addEventListener('keydown', (e) => {
        if (!gameActive) return;

        if (e.key === 'Backspace') {
            const currentRowCells = Array.from(rows[currentRow].children);
            const currentPos = currentRowCells.indexOf(e.target);
            
            if (e.target.value === '') {
                if (currentPos > 0) {
                    currentRowCells[currentPos - 1].focus();
                }
            } else {
                e.target.value = '';
            }
        } else if (e.key === 'Enter') {
            const currentRowCells = Array.from(rows[currentRow].children);
            const isRowComplete = currentRowCells.every(cell => cell.value !== '');
            
            if (isRowComplete) {
                validateRow();
            }
        }
    });
});

function validateRow() {
    const rowCells = Array.from(rows[currentRow].children);
    const guess = rowCells.map(cell => cell.value).join('');
    
    rowCells.forEach(cell => {
        cell.setAttribute('disabled', true);
    });
    
    let remainingLetters = WORD.split('');
    let correctPositions = new Array(WORD_LENGTH).fill(false);

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guess[i] === WORD[i]) {
            correctPositions[i] = true;
            remainingLetters[i] = null;
            rowCells[i].style.border = '2px solid #4CAF50';
        }
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (!correctPositions[i]) {
            const letterIndex = remainingLetters.indexOf(guess[i]);
            if (letterIndex !== -1) {
                rowCells[i].style.border = '2px solid #ffd700';
                remainingLetters[letterIndex] = null;
            } else {
                rowCells[i].style.border = '2px solid #ff0000';
            }
        }
    }

    if (guess === WORD) {
        endGame('Parabéns! Você venceu!');
        return;
    }

    currentRow++;
    if (currentRow < MAX_ATTEMPTS) {
        const nextRowCells = Array.from(rows[currentRow].children);
        nextRowCells.forEach(cell => cell.removeAttribute('disabled'));
        rows[currentRow].children[0].focus();
    } else {
        endGame(`Fim de jogo! A palavra era ${WORD}. Nome do player de podcasts que eu estou desenvolvendo para iOS com o "O" a mais, se quiser testar segue o link: https://loop-app.framer.website/loop-beta`);
    }
}

document.querySelectorAll('.cell').forEach(cell => {
    cell.setAttribute('disabled', true);
});