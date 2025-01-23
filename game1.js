const GRID_SIZE = 9;
const MINE_COUNT = 7;
let grid = [];

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isOpen = false;
        this.isMine = false;
        this.surroundingMines = 0;
        this.isSelectable = false;
    }
}

function initializeGrid() {
    grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
        let row = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            row.push(new Cell(x, y));
        }
        grid.push(row);
    }
    placeMines();
    calculateNumbers();
    setStartCell();
    setSelectableCells();
    renderGrid();
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
        let x = Math.floor(Math.random() * GRID_SIZE);
        let y = Math.floor(Math.random() * GRID_SIZE);
        
        if (!grid[y][x].isMine && !isSafeZone(x, y) && !isGoalZone(x, y)) {
            grid[y][x].isMine = true;
            minesPlaced++;
        }
    }
}

function isSafeZone(x, y) {
    const startX = Math.floor(GRID_SIZE / 2);
    const startY = GRID_SIZE - 1;
    return Math.abs(x - startX) <= 1 && Math.abs(y - startY) <= 1;
}

function isGoalZone(x, y) {
    const goalX = Math.floor(GRID_SIZE / 2);
    return y === 0 && x === goalX;
}

function setStartCell() {
    const startX = Math.floor(GRID_SIZE / 2);
    const startY = GRID_SIZE - 1;
    grid[startY][startX].isOpen = true;
    grid[startY][startX].isSelectable = true;
    updateSelectableCells(startX, startY);
}

function setSelectableCells() {
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (grid[y][x].isOpen) {
                updateSelectableCells(x, y);
            }
        }
    }
}

function calculateNumbers() {
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (!grid[y][x].isMine) {
                grid[y][x].surroundingMines = countSurroundingMines(x, y);
            }
        }
    }
}

function countSurroundingMines(x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            let newX = x + dx;
            let newY = y + dy;
            if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
                if (grid[newY][newX].isMine) {
                    count++;
                }
            }
        }
    }
    return count;
}

function renderGrid() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';
    gameContainer.style.display = 'grid';
    gameContainer.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 30px)`;
    gameContainer.style.gap = '2px';

    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            if (grid[y][x].isOpen) {
                cell.textContent = grid[y][x].surroundingMines || '0';
                cell.style.backgroundColor = '#bbb';
            } else {
                cell.style.backgroundColor = grid[y][x].isSelectable ? '#666' : '#999';
            }
            
            cell.addEventListener('click', () => openCell(x, y));
            gameContainer.appendChild(cell);
        }
    }
}

function openCell(x, y) {
    if (!grid[y][x].isSelectable) return;
    grid[y][x].isOpen = true;
    
    let cell = document.querySelector(`[data-x='${x}'][data-y='${y}']`);
    if (grid[y][x].isMine) {
        cell.textContent = '☓';
        cell.style.backgroundColor = 'red';
        alert('ゲームオーバー！');
        initializeGrid();
    } else {
        cell.textContent = grid[y][x].surroundingMines || '0';
        cell.style.backgroundColor = '#bbb';
        updateSelectableCells(x, y);
    }
    checkWin();
}

function checkWin() {
    const goalX = Math.floor(GRID_SIZE / 2);
    if (grid[0][goalX].isOpen) {
        alert('クリア！おめでとう！');
        initializeGrid();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initializeGrid();
});
