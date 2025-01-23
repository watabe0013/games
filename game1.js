const GRID_SIZE = 9;
const MINE_COUNT = 7;
let grid = [];

// マスオブジェクトの定義
class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isOpen = false;
        this.isMine = false;
        this.surroundingMines = 0;
        this.isSelectable = false; // 選択可能マスの判定
    }
}

// グリッドの初期化
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
    setSelectableCells();
    renderGrid();
}

// 地雷の配置
function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
        let x = Math.floor(Math.random() * GRID_SIZE);
        let y = Math.floor(Math.random() * GRID_SIZE);

        if (!grid[y][x].isMine && !isSafeZone(x, y)) {
            grid[y][x].isMine = true;
            minesPlaced++;
        }
    }
}

// スタート地点とその周囲を安全マスにする
function isSafeZone(x, y) {
    const startX = Math.floor(GRID_SIZE / 2);
    const startY = GRID_SIZE - 1;
    return Math.abs(x - startX) <= 1 && Math.abs(y - startY) <= 1;
}

// 選択可能なマスを設定
function setSelectableCells() {
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (grid[y][x].isOpen) {
                updateSelectableCells(x, y);
            }
        }
    }
}

// 周囲の地雷数を計算
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

// 盤面を表示
function renderGrid() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';

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

// マスを開く & 周囲をオープン可能にする
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

// 開けたマスの周囲のマスを選択可能にする
function updateSelectableCells(x, y) {
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            let newX = x + dx;
            let newY = y + dy;
            if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE && !grid[newY][newX].isOpen) {
                grid[newY][newX].isSelectable = true;
            }
        }
    }
    renderGrid();
}

// クリア判定
function checkWin() {
    const goalX = Math.floor(GRID_SIZE / 2);
    if (grid[0][goalX].isOpen) {
        alert('クリア！おめでとう！');
        initializeGrid();
    }
}

// ゲームのスタート
document.addEventListener("DOMContentLoaded", () => {
    initializeGrid();
});
