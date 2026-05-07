var canvas, lienzo;

// --- CARGA DE IMÁGENES ---
var imgBody = new Image();
imgBody.src = "recursos/imgs/body.png";
var imgFood = new Image();
imgFood.src = "recursos/imgs/fruit.png";
var imgWall = new Image();
imgWall.src = "recursos/imgs/wall.png";

// --- CARGA DE SONIDOS ---
var sndChomp = new Audio();
sndChomp.src = "recursos/sounds/chomp.ogg";
var sndDie = new Audio();
sndDie.src = "recursos/sounds/dies.ogg"; 

// --- VARIABLES DE JUEGO Y RÉCORDS (Ejercicio 1) ---
var score = 0;
var recordSesion = 0; 
var recordAbsoluto = localStorage.getItem("recordAbsoluto") || 0; 

var body = [];
var wall = [];
var wallDir = [];
var food;

var pause = false;
var gameover = false;

const ARRIBA = 0, DERECHA = 1, ABAJO = 2, IZQUIERDA = 3;
var dir = DERECHA;
var lastPress = null;

const KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40, KEY_LEFT = 37, KEY_P = 80, KEY_ENTER = 13;

function Rectangle(x, y, width, height) {
    this.x = x; this.y = y; this.width = width; this.height = height;
    this.draw = function(img) {
        if (img && img.complete && img.naturalWidth !== 0) {
            lienzo.drawImage(img, this.x, this.y, this.width, this.height);
        } else {
            lienzo.fillStyle = "#00FF00";
            lienzo.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.intersects = function(rect) {
        return (this.x < rect.x + rect.width && this.x + this.width > rect.x &&
                this.y < rect.y + rect.height && this.y + this.height > rect.y);
    }
}

function random(max) { return Math.floor(Math.random() * max); }

function reset() {
    score = 0;
    dir = DERECHA;
    gameover = false;
    lastPress = null;
    body = [new Rectangle(40, 40, 10, 10), new Rectangle(30, 40, 10, 10), new Rectangle(20, 40, 10, 10)];
    food = new Rectangle(200, 100, 10, 10);
    wall = [new Rectangle(100, 80, 10, 10), new Rectangle(100, 180, 10, 10), 
            new Rectangle(300, 80, 10, 10), new Rectangle(300, 180, 10, 10)];
    wallDir = wall.map(() => random(4));
}

function act() {
    if (lastPress == KEY_P) { pause = !pause; lastPress = null; }
    if (gameover && lastPress == KEY_ENTER) reset();
    if (pause || gameover) return;

    if (lastPress == KEY_UP && dir != ABAJO) dir = ARRIBA;
    if (lastPress == KEY_RIGHT && dir != IZQUIERDA) dir = DERECHA;
    if (lastPress == KEY_DOWN && dir != ARRIBA) dir = ABAJO;
    if (lastPress == KEY_LEFT && dir != DERECHA) dir = IZQUIERDA;

    for (var i = body.length - 1; i > 0; i--) {
        body[i].x = body[i - 1].x; body[i].y = body[i - 1].y;
    }

    if (dir == DERECHA) body[0].x += 10;
    if (dir == IZQUIERDA) body[0].x -= 10;
    if (dir == ARRIBA) body[0].y -= 10;
    if (dir == ABAJO) body[0].y += 10;

    if (body[0].x >= 500) body[0].x = 0; if (body[0].x < 0) body[0].x = 490;
    if (body[0].y >= 300) body[0].y = 0; if (body[0].y < 0) body[0].y = 290;

    if (body[0].intersects(food)) {
        score++;
        sndChomp.currentTime = 0; sndChomp.play().catch(() => {});
        body.push(new Rectangle(body[body.length - 1].x, body[body.length - 1].y, 10, 10));
        food.x = random(49) * 10; food.y = random(29) * 10;
    }

    // Comprobación de muerte
    let muerto = body.slice(1).some(part => body[0].intersects(part)) || 
                 wall.some(w => body[0].intersects(w));

    if (muerto) {
        gameover = true;
        sndDie.currentTime = 0; sndDie.play().catch(() => {});
        // Actualizar récords sin alerts
        if (score > recordSesion) recordSesion = score;
        if (score > recordAbsoluto) {
            recordAbsoluto = score;
            localStorage.setItem("recordAbsoluto", recordAbsoluto);
        }
    }

    wall.forEach((w, i) => {
        if (random(10) < 2) wallDir[i] = random(4);
        if (wallDir[i] == ARRIBA) w.y -= 10; if (wallDir[i] == DERECHA) w.x += 10;
        if (wallDir[i] == ABAJO) w.y += 10; if (wallDir[i] == IZQUIERDA) w.x -= 10;
        w.x = Math.max(0, Math.min(490, w.x)); w.y = Math.max(0, Math.min(290, w.y));
    });
}

function paint() {
    var grad = lienzo.createLinearGradient(0, 0, 0, 300);
    grad.addColorStop(0, "blue"); grad.addColorStop(1, "black");
    lienzo.fillStyle = grad; lienzo.fillRect(0, 0, 500, 300);

    // Texto de puntuación (Verde)
    lienzo.fillStyle = "#00FF00";
    lienzo.font = "14px Arial";
    lienzo.textAlign = "left";
    lienzo.fillText("Score: " + score, 20, 25);
    lienzo.fillText("Record sesión: " + recordSesion, 20, 45);
    lienzo.fillText("Record Absoluto: " + recordAbsoluto, 20, 65);

    body.forEach(p => p.draw(imgBody));
    food.draw(imgFood);
    wall.forEach(w => w.draw(imgWall));

    if (gameover) {
        lienzo.textAlign = "center";
        lienzo.font = "bold 16px Arial";
        lienzo.fillText("GAME OVER", 250, 110);
        
        // Mensajes de récord según la imagen
        if (score >= recordAbsoluto && score > 0) {
            lienzo.fillText("NEW RECORD ALL TIME " + score, 250, 150);
        } else if (score >= recordSesion && score > 0) {
            lienzo.fillText("NEW RECORD " + score, 250, 150);
        }
    }
}

function run() { setTimeout(run, 120); act(); paint(); }
function iniciar() { canvas = document.getElementById("lienzo"); lienzo = canvas.getContext("2d"); reset(); run(); }
window.addEventListener("load", iniciar);
document.addEventListener("keydown", (e) => { if([37,38,39,40].includes(e.keyCode)) e.preventDefault(); lastPress = e.keyCode; });