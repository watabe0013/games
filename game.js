let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let player = { x: 225, y: 450, width: 50, height: 50, speed: 5 };

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft" && player.x > 0) {
        player.x -= player.speed;
    }
    if (event.key === "ArrowRight" && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
    requestAnimationFrame(draw);
}

draw();
