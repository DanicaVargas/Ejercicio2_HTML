// menu.js
function principal() {
    // Buscamos el enlace vacío que creaste en el Ejercicio 3
    var botonMenu = document.querySelector('nav > a');
    // Buscamos la lista de enlaces
    var listaMenu = document.querySelector('nav > ul');

    // Cuando hagas clic en el botón...
    botonMenu.addEventListener('click', function(e) {
        e.preventDefault(); // Evita que el enlace te mueva la página
        // Quita o pone la clase "desplegado"
        listaMenu.classList.toggle('desplegado');
    });
}

window.addEventListener('load', principal);