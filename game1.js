document.addEventListener("DOMContentLoaded", () => {
    initializeBoard();
});

const rows = 9;
const cols = 9;
const mineCount = 7; // 地雷の数を7個に設定
const startRow = 8; // 一番下
const startCol = 4; // 真ん中の列
const goalRow = 0; // 一番上
const goalCol = 4; // 真ん中の列

let board = [];
let mines = new Set();
let playerPosition = { row: startRow, col: startCol };
let revealedCells = new Set();

function initializeBoard() {
    console.log("ボード初期化開始");
    const gameBoard = document.getElementById("game-board");
    if (!gameBoard) {
        console.error("game-board の取得に失敗しました");
        return;
    }

    gameBoard.innerHTML = "";
    board = Array.from({ length: rows }, () => Array(cols).fill(0));
    mines.clear();
    revealedCells.clear();

    placeMines();
    calculateNumbers();
    revealCell(startRow, startCol);
    drawBoard();
    updatePlayerPosition();

    console.log("ボード初期化完了");
}

// 地雷を配置する関数（スタート・ゴール・スタートの周囲には配置しない）
function placeMines() {
    mines.clear();
    while (mines.size < mineCount) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);

        // スタート地点、ゴール地点、およびスタート地点の周囲には地雷を置かない
        if (isSafeZone(r, c)) continue;

        mines.add(`${r},${c}`);
    }
}

// スタート地点、ゴール地点、スタート周囲のマスをチェック
function isSafeZone(row, col) {
    // スタート地点とゴール地点
    if ((row === startRow && col === startCol) || (row === goalRow && col === goalCol)) {
        return true;
    }

    // スタート地点の周囲8マス
    let directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 0], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    
    for (let [dr, dc] of directions) {
        if (row === startRow + dr && col === startCol + dc) {
            return true;
        }
    }
    return false;
}

// 数字を計算する関数
function calculateNumbers() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (mines.has(`${r},${c}`)) {
                board[r][c] = "M";
            } else {
                board[r][c] = countMines(r, c);
            }
        }
    }
}

// 指定マスの周囲の地雷数を数える
function countMines(row, col) {
    let directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    let count = 0;
    for (let [dr, dc] of directions) {
        let nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && mines.has(`${nr},${nc}`)) {
            count++;
        }
    }
    return count;
}

// ボードを描画
function drawBoard() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = "";
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener("click", () => handleCellClick(r, c));
            gameBoard.appendChild(cell);
        }
    }
}

// プレイヤーの位置を更新
function updatePlayerPosition() {
    document.querySelectorAll(".cell").forEach(cell => {
        let r = parseInt(cell.dataset.row);
        let c = parseInt(cell.dataset.col);
        cell.classList.remove("player", "selectable");

        if (r === playerPosition.row && c === playerPosition.col) {
            cell.classList.add("player");
        } else if (isSelectable(r, c)) {
            cell.classList.add("selectable");
        }
    });

    document.getElementById("current-position").textContent = `${playerPosition.row + 1},${playerPosition.col + 1}`;
}

// すでに開けたマスの周囲のマスをすべて選択可能に
function isSelectable(row, col) {
    if (revealedCells.has(`${row},${col}`)) return false;
    for (let key of revealedCells) {
        let [r, c] = key.split(",").map(Number);
        if (Math.abs(r - row) <= 1 && Math.abs(c - col) <= 1) {
            return true;
        }
    }
    return false;
}

// セルを開く処理
function handleCellClick(row, col) {
    if (!isSelectable(row, col)) return;

    let cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add("revealed");

    if (mines.has(`${row},${col}`)) {
        cell.classList.add("mine");
        alert("地雷を踏んだ！最初から再スタート！");
        playerPosition = { row: startRow, col: startCol };
        initializeBoard();
        return;
    } else {
        revealCell(row, col);
    }

    playerPosition = { row, col };
    updatePlayerPosition();

    if (row === goalRow && col === goalCol) {
        alert("ゴール！勝利！");
        playerPosition = { row: startRow, col: startCol };
        initializeBoard();
    }
}

// マスを開く（0 も表示する）
function revealCell(row, col) {
    let cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!cell || revealedCells.has(`${row},${col}`)) return;

    cell.classList.add("revealed");
    cell.textContent = board[row][col];
    revealedCells.add(`${row},${col}`);

    updatePlayerPosition();
}
