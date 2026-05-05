window.addEventListener("load", iniciarAnimacion);

function iniciarAnimacion() {
    // 1. Seleccionamos los tres contenedores principales del tablón
    var art1 = document.querySelector(".article-first");
    var art2 = document.querySelector(".article-second");
    var art3 = document.querySelector(".article-third");

    if (!art1 || !art2 || !art3) return; // Control de seguridad por si no existen

    // 2. Seleccionamos la chincheta interna de cada contenedor
    var ch1 = art1.querySelector(".chincheta");
    var ch2 = art2.querySelector(".chincheta");
    var ch3 = art3.querySelector(".chincheta");

    // --- ENCADENAMIENTO DE ANIMACIONES ---

    // Paso 1: Arrancamos asignando la clase 'chincheta1' a la primera chincheta inmediatamente
    if (ch1) {
        ch1.classList.add("chincheta1");

        // Paso 2: Cuando termine de moverse la primera chincheta, rotamos el primer contenedor
        ch1.addEventListener("animationend", function() {
            art1.classList.add("article1");
        });
    }

    // Paso 3: Cuando termine de rotar el primer contenedor, movemos la segunda chincheta
    art1.addEventListener("animationend", function() {
        if (ch2) ch2.classList.add("chincheta2");
    });

    // Paso 4: Cuando termine de moverse la segunda chincheta, movemos la tercera chincheta
    if (ch2) {
        ch2.addEventListener("animationend", function() {
            if (ch3) ch3.classList.add("chincheta3");
        });
    }

    // Paso 5: Cuando termine de moverse la tercera chincheta, rotamos el tercer contenedor
    if (ch3) {
        ch3.addEventListener("animationend", function() {
            art3.classList.add("article3");
        });
    }
}