var canvas, lienzo;

// --- CARGA DE IMÁGENES ---
// Salimos de "scripts" (../) y entramos en "recursos/imgs/"
var imgBody = new Image();
imgBody.src = "recursos/imgs/body.png";

var imgFood = new Image();
imgFood.src = "recursos/imgs/fruit.png";

var imgWall = new Image();
imgWall.src = "recursos/imgs/wall.png";
// --- CARGA DE SONIDOS ---
// Salimos de "scripts" (../) y entramos en "recursos/sounds/"
var sndChomp = new Audio();
sndChomp.src = "recursos/sounds/chomp.ogg";

var sndDie = new Audio();
sndDie.src = "recursos/sounds/dies.ogg"; // Si falla el sonido, comprueba si en tu carpeta "sounds" se llama "die.ogg" o "dies.ogg"

var body = [];
var wall = [];
var wallDir = [];
var food;

var score = 0;
var pause = false;
var gameover = false;

const ARRIBA = 0;
const DERECHA = 1;
const ABAJO = 2;
const IZQUIERDA = 3;

var dir = DERECHA;
var lastPress = null;

const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_P = 80;
const KEY_ENTER = 13;

function Rectangle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.draw = function(img) {
        // Si la imagen existe y está cargada en el navegador, la dibuja
        if (img && img.complete && img.naturalWidth !== 0) {
            lienzo.drawImage(img, this.x, this.y, this.width, this.height);
        } else {
            // Cuadrado verde temporal si la imagen falla para que no sea invisible
            lienzo.fillStyle = "lime";
            lienzo.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.intersects = function(rect) {
        return (
            this.x < rect.x + rect.width &&
            this.x + this.width > rect.x &&
            this.y < rect.y + rect.height &&
            this.y + this.height > rect.y
        );
    }
}

function random(max) {
    return Math.floor(Math.random() * max);
}

function reset() {
    score = 0;
    dir = DERECHA;
    gameover = false;
    lastPress = null;

    body = [];
    // Inicializar cabeza y cola con espacio para que no colisionen al arrancar
    body.push(new Rectangle(40, 40, 10, 10));
    body.push(new Rectangle(30, 40, 10, 10));
    body.push(new Rectangle(20, 40, 10, 10));

    food = new Rectangle(200, 100, 10, 10);

    wall = [];
    wallDir = [];

    // Colocamos los muros iniciales lejos del punto de spawn de la serpiente
    wall.push(new Rectangle(100, 80, 10, 10));
    wall.push(new Rectangle(100, 180, 10, 10));
    wall.push(new Rectangle(300, 80, 10, 10));
    wall.push(new Rectangle(300, 180, 10, 10));

    for (var i = 0; i < wall.length; i++) {
        wallDir.push(random(4));
    }
}

function act() {
    if (lastPress == KEY_P) {
        pause = !pause;
        lastPress = null;
    }

    if (gameover && lastPress == KEY_ENTER) {
        reset();
    }

    if (pause || gameover) return;

    if (lastPress == KEY_UP && dir != ABAJO) dir = ARRIBA;
    if (lastPress == KEY_RIGHT && dir != IZQUIERDA) dir = DERECHA;
    if (lastPress == KEY_DOWN && dir != ARRIBA) dir = ABAJO;
    if (lastPress == KEY_LEFT && dir != DERECHA) dir = IZQUIERDA;

    // Mover cuerpo
    for (var i = body.length - 1; i > 0; i--) {
        body[i].x = body[i - 1].x;
        body[i].y = body[i - 1].y;
    }

    // Mover cabeza
    if (dir == DERECHA) body[0].x += 10;
    if (dir == IZQUIERDA) body[0].x -= 10;
    if (dir == ARRIBA) body[0].y -= 10;
    if (dir == ABAJO) body[0].y += 10;

    // Atravesar bordes
    if (body[0].x >= 500) body[0].x = 0;
    if (body[0].x < 0) body[0].x = 490;
    if (body[0].y >= 300) body[0].y = 0;
    if (body[0].y < 0) body[0].y = 290;

    // Comer comida
    if (body[0].intersects(food)) {
        score++;
        
        // Sonido al comer
        sndChomp.currentTime = 0;
        sndChomp.play().catch(function(e) {
            console.log("Audio bloqueado: haz clic en la pantalla primero para activar el sonido.");
        });

        // Crecer agregando segmento al final
        body.push(new Rectangle(body[body.length - 1].x, body[body.length - 1].y, 10, 10));
        food.x = random(49) * 10;
        food.y = random(29) * 10;
    }

    // Chocar consigo misma (Solo comprobamos si el juego ha empezado y hay movimiento)
    for (var i = 1; i < body.length; i++) {
        if (body[0].intersects(body[i])) {
            gameover = true;
            sndDie.currentTime = 0;
            sndDie.play().catch(function(e) {});
        }
    }

    // Mover paredes automáticamente
    for (var i = 0; i < wall.length; i++) {
        if (random(10) < 2) { 
            wallDir[i] = random(4);
        }

        if (wallDir[i] == ARRIBA) wall[i].y -= 10;
        if (wallDir[i] == DERECHA) wall[i].x += 10;
        if (wallDir[i] == ABAJO) wall[i].y += 10;
        if (wallDir[i] == IZQUIERDA) wall[i].x -= 10;

        // Límites de los muros móviles
        if (wall[i].x < 0) wall[i].x = 0;
        if (wall[i].x > 490) wall[i].x = 490;
        if (wall[i].y < 0) wall[i].y = 0;
        if (wall[i].y > 290) wall[i].y = 290;
    }

    // Choque con paredes móviles
    for (var i = 0; i < wall.length; i++) {
        if (body[0].intersects(wall[i])) {
            gameover = true;
            sndDie.currentTime = 0;
            sndDie.play().catch(function(e) {});
        }
    }
}

function paint() {
    // Dibujar fondo degradado
    var grad = lienzo.createLinearGradient(0, 0, 0, 300);
    grad.addColorStop(0, "blue");
    grad.addColorStop(1, "black");

    lienzo.fillStyle = grad;
    lienzo.fillRect(0, 0, 500, 300);

    // Score
    lienzo.fillStyle = "white";
    lienzo.font = "12px Arial";
    lienzo.fillText("Score: " + score, 10, 15);

    // Dibujar serpiente
    for (var i = 0; i < body.length; i++) {
        body[i].draw(imgBody);
    }

    // Comida
    food.draw(imgFood);

    // Paredes
    for (var i = 0; i < wall.length; i++) {
        wall[i].draw(imgWall);
    }

    // Mensajes de pausa y muerte
    if (gameover) {
        lienzo.fillStyle = "white";
        lienzo.font = "20px Arial";
        lienzo.textAlign = "center";
        lienzo.fillText("GAME OVER", 250, 140);
        lienzo.font = "14px Arial";
        lienzo.fillText("Presiona ENTER para volver a empezar", 250, 170);
        lienzo.textAlign = "left";
    }

    if (pause) {
        lienzo.fillStyle = "white";
        lienzo.font = "20px Arial";
        lienzo.textAlign = "center";
        lienzo.fillText("PAUSA", 250, 150);
        lienzo.textAlign = "left";
    }
}

function run() {
    setTimeout(run, 120);
    act();
    paint();
}

function iniciar() {
    canvas = document.getElementById("lienzo");
    lienzo = canvas.getContext("2d");

    reset();
    run();
}

window.addEventListener("load", iniciar);

document.addEventListener("keydown", function(e) {
    if ([KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT].indexOf(e.keyCode) > -1) {
        e.preventDefault(); // Evitamos que la web se mueva al presionar las flechas
    }
    lastPress = e.keyCode;
});