document.addEventListener("DOMContentLoaded", () => {
    initializeBoard();
});

const rows = 9;
const cols = 9;
const mineCount = 10;
const startRow = 4; // 5九（0始まりなので4）
const startCol = 8; // 9列目（0始まりなので8）
const goalRow = 4; // 5一（0始まりなので4）
const goalCol = 0; // 1列目（0始まりなので0）

let board = [];
let mines = new Set();
let playerPosition = { row: startRow, col: startCol };

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

    // 地雷を配置
    while (mines.size < mineCount) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if ((r !== startRow || c !== startCol) && (r !== goalRow || c !== goalCol)) {
            mines.add(`${r},${c}`);
            board[r][c] = "M";
        }
    }

    // 地雷カウントを計算
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === "M") continue;
            board[r][c] = countMines(r, c);
        }
    }

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
        cell.classList.remove("player");
        if (r === playerPosition.row && c === playerPosition.col) {
            cell.classList.add("player");
        }
    });

    document.getElementById("current-position").textContent = `${playerPosition.row + 1},${playerPosition.col + 1}`;
}

// セルを開く処理
function handleCellClick(row, col) {
    if (Math.abs(row - playerPosition.row) > 1 || Math.abs(col - playerPosition.col) > 1) {
        return;
    }

    let cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add("revealed");

    if (mines.has(`${row},${col}`)) {
        cell.classList.add("mine");
        alert("地雷を踏んだ！ゲームオーバー！");
        initializeBoard();
        return;
    } else {
        cell.textContent = board[row][col] || "";
    }

    playerPosition = { row, col };
    updatePlayerPosition();

    if (row === goalRow && col === goalCol) {
        alert("ゴール！勝利！");
        initializeBoard();
    }
}
