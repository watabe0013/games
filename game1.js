const GRID_SIZE = 15;
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
}

// 地雷の配置（ランダム）
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

// ゲームのスタート
initializeGrid();
console.log(grid);
