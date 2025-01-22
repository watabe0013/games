document.addEventListener("DOMContentLoaded", () => {
    initializeBoard();
});

const rows = 9;
const cols = 9;
const mineCount = 10;
const startRow = 8; // 一番下
const startCol = 4; // 真ん中の列
const goalRow = 0; // 一番上
const goalCol = 4; // 真ん中の列

let board = [];
let mines = new Set();
let playerPosition = { row: startRow, col: startCol };
let revealedCells = new Set(); // 開けたマスのセット

// ボード初期化
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

    // 地雷を配置（スタート地点には地雷を置かない）
    while (mines.size < mineCount) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if ((r !== startRow || c !== startCol) && (r !== goalRow || c !== goalCol)) {
            mines.add(`${r},${c}`);
            board[r][c] = "M";
        }
    }

    // スタート地点の周囲に地雷がないようにする
    if (countMines(startRow, startCol) > 0) {
        console.log("スタート位置の周囲に地雷があるため、リセット");
        return initializeBoard(); // 再生成
    }

    // 地雷カウントを計算
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === "M") continue;
            board[r][c] = countMines(r, c);
        }
    }

    // スタート位置のマスを開ける
    revealCell(startRow, startCol);

    // ボードを描画
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

    updatePlayerPosition();
    console.log("ボード初期化完了");
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
