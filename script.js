const sudokuContainer = document.getElementById('sudoku-container');
const music = document.getElementById('backgroundMusic');
const musicButton = document.getElementById('musicButton');
let message = document.getElementById('message');
const timerElement = document.createElement('div');
timerElement.id = 'timer';
timerElement.style.marginTop = '20px';
timerElement.style.fontSize = '18px';
timerElement.style.fontWeight = 'bold';
timerElement.style.textAlign = 'center';

// Ensure the message element exists
if (!message) {
    message = document.createElement('div');
    message.id = 'message';
    document.body.appendChild(message);
}

// Ensure that the timer element is inserted after the message element is in the DOM
window.addEventListener('DOMContentLoaded', (event) => {
    // Insert the timer element above the message element
    document.body.insertBefore(timerElement, message);
});

let timer;
let timeLeft = 1800; // 30 minutes in seconds

// Start the timer
function startTimer() {
    timerElement.textContent = `Time Left: ${formatTime(timeLeft)}`;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time Left: ${formatTime(timeLeft)}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            message.textContent = "Time's up! Better luck next time!";
            message.style.color = 'red';
        }
    }, 1000);
}

// Format time in mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Create the Sudoku grid
function createGrid() {
    sudokuContainer.innerHTML = ''; // Clear any existing grid
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.classList.add('cell');

            if (row % 3 === 0 && row !== 0) input.style.borderTop = '2px solid #333';
            if (col % 3 === 0 && col !== 0) input.style.borderLeft = '2px solid #333';

            input.addEventListener('input', (e) => {
                const value = e.target.value;
                if (!/^[1-9]$/.test(value)) {
                    e.target.value = '';
                }
            });

            sudokuContainer.appendChild(input);
        }
    }
}

// Clear the Sudoku board
function clearBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.value = '';
    });
    message.textContent = '';
}

// Generate a simple puzzle (for demonstration purposes)
function generatePuzzle() {
    clearBoard();
    const puzzle = [
        [5, 3, '', '', 7, '', '', '', ''],
        [6, '', '', 1, 9, 5, '', '', ''],
        ['', 9, 8, '', '', '', '', 6, ''],
        [8, '', '', '', 6, '', '', '', 3],
        [4, '', '', 8, '', 3, '', '', 1],
        [7, '', '', '', 2, '', '', '', 6],
        ['', 6, '', '', '', '', 2, 8, ''],
        ['', '', '', 4, 1, 9, '', '', 5],
        ['', '', '', '', 8, '', '', 7, 9]
    ];

    const cells = document.querySelectorAll('.cell');
    if (cells.length !== 81) {
        console.error('Error: Sudoku grid is not properly created.');
        return;
    }

    for (let i = 0; i < 81; i++) {
        const row = Math.floor(i / 9);
        const col = i % 9;
        if (puzzle[row][col] !== '') {
            cells[i].value = puzzle[row][col];
            cells[i].readOnly = true;
            cells[i].style.backgroundColor = '#f0f0f0';
        } else {
            cells[i].readOnly = false;
            cells[i].style.backgroundColor = '#fff';
        }
    }
}

// Toggle music playback
function toggleMusic() {
    if (music.paused) {
        music.play();
        musicButton.textContent = 'Pause Music';
    } else {
        music.pause();
        musicButton.textContent = 'Play Music';
    }
}

// Check solution and assign title
function checkSolution() {
    const cells = document.querySelectorAll('.cell');
    if (cells.length !== 81) {
        console.error('Error: Sudoku grid is not properly created.');
        return;
    }

    const board = [];
    for (let i = 0; i < 9; i++) {
        board.push([]);
        for (let j = 0; j < 9; j++) {
            const cellIndex = i * 9 + j;
            const value = cells[cellIndex].value;
            board[i].push(value ? parseInt(value, 10) : 0);
        }
    }

    if (isSolved(board)) {
        clearInterval(timer);
        const timeUsed = 1800 - timeLeft;

        if (timeUsed <= 600) {
            message.textContent = "Congratulations! You are a Speed Solver!";
            message.style.color = 'gold';
        } else if (timeUsed <= 900) {
            message.textContent = "Congratulations! You are a Master of Patience!";
            message.style.color = 'blue';
        } else if (timeUsed <= 1800) {
            message.textContent = "Congratulations! You are a Sudoku Sage!";
            message.style.color = 'green';
        }
    } else {
        message.textContent = "Incorrect solution. Try again!";
        message.style.color = 'red';
    }
}

// Check if the board is solved correctly
function isSolved(board) {
    for (let i = 0; i < 9; i++) {
        if (!isValidLine(board[i]) || !isValidLine(board.map(row => row[i]))) {
            return false;
        }
    }

    for (let row = 0; row < 9; row += 3) {
        for (let col = 0; col < 9; col += 3) {
            const block = [];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    block.push(board[row + i][col + j]);
                }
            }
            if (!isValidLine(block)) {
                return false;
            }
        }
    }

    return true;
}

// Validate a single row, column, or block
function isValidLine(line) {
    const seen = new Set();
    for (const num of line) {
        if (num === 0) return false;
        if (seen.has(num)) return false;
        seen.add(num);
    }
    return true;
}

// Reset the game and start the timer
function resetGame() {
    clearInterval(timer);
    timeLeft = 1800;
    startTimer();
    clearBoard();
    generatePuzzle();
}

// Initialize the Sudoku grid and start the timer
createGrid();
startTimer();
generatePuzzle();

