function redimensionaBarra()
{
    if(!medio.ended)
    {
        var total = parseInt(medio.currentTime * maximo / medio.duration);
        progreso.style.width = total + 'px';
    }
    else
    {
        progreso.style.width = '0px';
        play.value = '\u25BA';
        window.clearInterval(bucle);
    }
}

function desplazarMedio(e)
{
    if(!medio.paused && !medio.ended)
    {
        var ratonX = e.pageX - barra.offsetLeft;
        var nuevoTiempo = ratonX * medio.duration / maximo;
        medio.currentTime = nuevoTiempo;
        progreso.style.width = ratonX + 'px';
    }
}

function accionPlay()
{
    if(!medio.paused && !medio.ended)
    {
        medio.pause();
        play.value = '\u25BA';
        window.clearInterval(bucle);
    }
    else
    {
        medio.play();
        play.value = '||';
        bucle = setInterval(redimensionaBarra, 1000);
    }
}

/* Ejercicio 5: reiniciar */
function accionReiniciar()
{
    if(!medio.paused || medio.currentTime > 0)
    {
        medio.currentTime = 0;
        medio.play();
        play.value = '||';
        window.clearInterval(bucle);
        bucle = setInterval(redimensionaBarra, 1000);
    }
}

/* Ejercicio 5: retrasar 5 segundos */
function accionRetrasar()
{
    var nuevoTiempo = medio.currentTime - 5;
    if(nuevoTiempo < 0) nuevoTiempo = 0;
    medio.currentTime = nuevoTiempo;
}

/* Ejercicio 5: adelantar 5 segundos */
function accionAdelantar()
{
    var nuevoTiempo = medio.currentTime + 5;
    if(nuevoTiempo > medio.duration) nuevoTiempo = medio.duration;
    medio.currentTime = nuevoTiempo;
}

/* Ejercicio 5: silenciar / escuchar */
function accionSilenciar()
{
    if(!medio.muted)
    {
        medio.muted = true;
        silenciar.value = 'escuchar';
    }
    else
    {
        medio.muted = false;
        silenciar.value = 'silenciar';
    }
}

/* Ejercicio 5: bajar volumen */
function accionMenosVolumen()
{
    var volumen = medio.volume - 0.1;
    if(volumen < 0) volumen = 0;
    medio.volume = parseFloat(volumen.toFixed(1));
}

/* Ejercicio 5: subir volumen */
function accionMasVolumen()
{
    var volumen = medio.volume + 0.1;
    if(volumen > 1) volumen = 1;
    medio.volume = parseFloat(volumen.toFixed(1));
}

function iniciar()
{
    maximo = 700;

    medio         = document.getElementById('medio');
    barra         = document.getElementById('barra');
    progreso      = document.getElementById('progreso');
    play          = document.getElementById('play');
    silenciar     = document.getElementById('silenciar');

    play.addEventListener('click',         accionPlay,         false);
    barra.addEventListener('click',        desplazarMedio,     false);

    /* Ejercicio 5: manejadores de eventos para el resto de botones */
    document.getElementById('reiniciar').addEventListener('click',    accionReiniciar,    false);
    document.getElementById('retrasar').addEventListener('click',     accionRetrasar,     false);
    document.getElementById('adelantar').addEventListener('click',    accionAdelantar,    false);
    silenciar.addEventListener('click',    accionSilenciar,    false);
    document.getElementById('menosVolumen').addEventListener('click', accionMenosVolumen, false);
    document.getElementById('masVolumen').addEventListener('click',   accionMasVolumen,   false);
}

window.addEventListener('load', iniciar, false);
