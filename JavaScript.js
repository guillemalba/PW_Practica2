var group_token = "b89f9647";
var code;
var token;
var jugadorAux;
var jugador1;
var jugadorsAprop;
var infoEnemics;
var matrixMinimap = new Array(40);
var viu = false;
var playersObjects;
var map;
var updateMap;

/* crea l'array del minimapa */
for (var i = 0; i < matrixMinimap.length; i++) {
    matrixMinimap[i] = new Array(40);
}


/*
 * @Descripción: Elimina el jugador indicado.
 * @Paràmetres: - group_token: identificador único del grupo de prácticas.
 *              - token: identificador único del jugador.
 *              - code: código de seguridad del jugador.
 * @Códigos de retorno: 200 Si se ha eliminado correctamente.
 * @Contenido de retorno: Sin contenido.
 * @Formato de llamada: http://battlearena.danielamo.info/api/remove/<group_token>/<token>/<code>
 */
function remove () {
    var status;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://battlearena.danielamo.info/api/remove/" + group_token + "/" + token + "/" + code, true);
    xhr.onload = function () {
        status = xhr.status;
        if (status == 200) {
            console.log ("S'ha esborrat el jugador");
            viu = false;
            clearInterval(updateMap);
        }
        else {
            console.error(xhr.statusText);
        }
    };
    xhr.onerror = function () {
        console.error(xhr.statusText);
    };
    xhr.send();
    return status;
}


/*
 * @Descripción: Genera un nuevo jugador.
 * @Paràmetres: - group_token: identificador único del grupo de prácticas.
                - name: nombre del jugador.
 * @Códigos de retorno: 200 Si se ha generado correctamente.
 * @Contenido de retorno: JSON con el token único del jugador y el código de seguridad de borrado. 
 *      El código de seguridad de borrado sirve para evitar que otros jugadores puedan borrar un jugador.
 * @Formato de llamada: http://battlearena.danielamo.info/api/spawn/<group_token>/<nombre>
 */
function spawn () {
    var status;
    var primerCop = true;
    var xhr = new XMLHttpRequest();
    var nombre = prompt("Escribe el nombre de tu personaje: ");
    xhr.open("GET", "http://battlearena.danielamo.info/api/spawn/" + group_token + "/" + nombre, true);
    xhr.onload = function () {
        status = xhr.status;
        if (status == 200) {
            aux = JSON.parse(this.responseText);
            token = aux.token;
            code = aux.code;
            player(primerCop);
            console.log ("S'ha creat el jugador");
            viu = true;
            /* actualitza el minimapa cada 1 segon */
            updateMap = setInterval(ompleMinimapa, 1000); 
        }
        else {
            console.error(xhr.statusText);
        }
    };
    xhr.onerror = function () {
        console.error(xhr.statusText);
    };
    xhr.send();
    return status;
}


/*
 * @Descripción: Regenera un nuevo jugador, actualizando posición, imagen y puntos de vida.
 * @Paràmetres: - group_token: Identificador único del grupo de prácticas.
                - token: Identificador único del jugador.
 * @Códigos de retorno: 200 Si se ha regenerado el jugador correctamente.
 * @Contenido de retorno: Sin contenido.
 * @Formato de llamada: http://battlearena.danielamo.info/api/respawn/<group_token>/<token>
 */
function respawn () {
    var status;
    var primerCop = true;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://battlearena.danielamo.info/api/respawn/" + group_token + "/" + token, true);
    xhr.onload = function () {
        status = xhr.status;
        if (status == 200) {
            console.log ("S'ha actualitzat el jugador");
            player(primerCop);
            viu = true;
        }
        else {
            console.error(xhr.statusText);
        }
    };
    xhr.onerror = function () {
        console.error(xhr.statusText);
    };
    xhr.send();
    return status;
}


/*
 * @Descripción: Devuelve información detallada del jugador.
 * @Paràmetres: - group_token: identificador único del grupo de prácticas.
 *              - token: Identificador único del jugador.
 * @Códigos de retorno: 200 Si se han podido consultar la información del jugador.
 * @Contenido de retorno: JSON con la información del jugador.
 * @Formato de llamada: http://battlearena.danielamo.info/api/player/<group_token>/<token>
 */
function player (primer) {
    var status;
    var rotateAngle;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://battlearena.danielamo.info/api/player/" + group_token + "/" + token, true);
    xhr.onload = function () {
        status = xhr.status;
        if (status == 200) {
            jugadorAux = JSON.parse(xhr.responseText);
            console.log ("S'ha rebut la informació del jugador");

            /* creem un nou jugador */
            jugador1 = new jugador (token, code, jugadorAux);
            jugador1.foto_Nav();

            /* mostrem la informació del jugador per pantalla */
            document.getElementById("namePlayer").textContent = jugador1.name;
            document.getElementById("playerPositionX").textContent = jugador1.pos_x;
            document.getElementById("playerPositionY").textContent = jugador1.pos_y;
            document.getElementById("playerOrientation").textContent = jugador1.direccion;
            document.getElementById("playerPoints").textContent = jugador1.puntos;
            switch (jugador1.direccion) {
                case "N":
                    rotateAngle = 0;
                    break;
                case "S":
                    rotateAngle = 180;
                    break;
                case "O":
                    rotateAngle = 90;
                    break;
                case "E":
                    rotateAngle = 270;
                    break;
            }
            document.getElementById("brujula").setAttribute("style", "transform: rotate(" + rotateAngle + "deg)");

            /* si és el primer cop que entra ens guardem la informació del jugador al localStorage */
            if (primer) {
                document.getElementById("brujula").setAttribute("src", "img/brujula.png");
                var jugador_local = JSON.stringify(jugador1);
                localStorage.setItem("spawn_" + localStorage.length, jugador_local);
            }
            primer = false;
        }
        else {
            console.error(xhr.statusText);
        }
    };
    xhr.onerror = function () {
        console.error(xhr.statusText);
    };
    xhr.send();
    return status;
}


document.addEventListener('keydown', pulsarTecla);

/*
 * @Descripción: 
 * @Paràmetres: - event: identificador único del grupo de prácticas.
 * @Códigos de retorno: 200 Si se han podido consultar la información del jugador.
 * @Contenido de retorno: JSON con la información del jugador.
 * @Formato de llamada: http://battlearena.danielamo.info/api/player/<group_token>/<token>
 */
function pulsarTecla (event) {
    var opcion;
    switch(event.keyCode){
        /* Move Keys */
        case 37: /* Girar izquierda con la fecha de la izquierda */
            opcion = 1;   
            document.getElementById("enemic").setAttribute("src", "");
            jugador1.girar(opcion);   
            mostrarEnemic(); 
            break;
        case 38: /* Avanzar con la flecha hacia arriba */
            jugador1.move();   
            mostrarEnemic();
            break;
        case 39: /* Girar derecha con la fecha de la derecha */
            opcion = 2;
            document.getElementById("enemic").setAttribute("src", "");
            jugador1.girar(opcion);  
            mostrarEnemic();
            break;
        case 16: /* Doble salto hacia adelante con shift */
            if ((jugador1.pos_x < 38 && jugador1.pos_x > 1) || (jugador1.pos_y < 38 && jugador1.pos_y > 1)) {
                document.getElementById("enemic").setAttribute("src", "");
                jugador1.move(); 
                jugador1.move(); 
                mostrarEnemic();
            }
            else {
                alert("Error! No puedes hacer un salto doble");
            }
            break;

        /* Attck Keys */
        case 87:    /* W - Front attack */
            switch (jugador1.direccion) {
                case "N": jugador1.atacar("N"); break;
                case "S": jugador1.atacar("S"); break;
                case "O": jugador1.atacar("O"); break;
                case "E": jugador1.atacar("E"); break;
            }
            break;
        case 83:    /* S - Back attack */
            switch (jugador1.direccion) {
                case "N": jugador1.atacar("S"); break;
                case "S": jugador1.atacar("N"); break;
                case "O": jugador1.atacar("E"); break;
                case "E": jugador1.atacar("O"); break;
            }
            break;
        case 68:    /* D - Right attack */
            switch (jugador1.direccion) {
                case "N": jugador1.atacar("E"); break;
                case "S": jugador1.atacar("O"); break;
                case "O": jugador1.atacar("N"); break;
                case "E": jugador1.atacar("S"); break;
            }
            break;
        case 65:    /* A - Left attack */
            switch (jugador1.direccion) {
                case "N": jugador1.atacar("O"); break;
                case "S": jugador1.atacar("E"); break;
                case "O": jugador1.atacar("S"); break;
                case "E": jugador1.atacar("N"); break;
            }
            break;
    }
}

/*
 * @Finalitat: Mostra la imatge del enemic a on nosaltres tinguem la direccio
 * @Paràmetres: no
 * @Retorn: no
 */
function mostrarEnemic () {
    var trobat = false;
    
    for (var i = 0; i < jugadorsAprop.enemies.length && !trobat; i++) {

        /* en el caso de que sea un enemigo fantasma que lo muestre pero con poca opacidad */
        if (jugadorsAprop.enemies[i].vitalpoints <= 0) {
            document.getElementById("enemic").style.opacity="0.3";
        }
        /* en el caso de que no lo sea que lo muestre bien */
        else {
            document.getElementById("enemic").style.opacity="1";
        }

        /* si estas mirando hacia arriba y tienes un jugador que lo muestre */
        if ((jugadorsAprop.enemies[i].x == jugador1.pos_x) && (jugadorsAprop.enemies[i].y > jugador1.pos_y) && (jugador1.direccion == "N")) {
            document.getElementById("enemic").setAttribute("src", "battlearena-avatars/my_character-" + jugadorsAprop.enemies[i].image + ".png");
            trobat = true;
        }

        /* si estas mirando hacia abajo y tienes un jugador que lo muestre */
        if ((jugadorsAprop.enemies[i].x == jugador1.pos_x) && (jugadorsAprop.enemies[i].y < jugador1.pos_y) && (jugador1.direccion == "S")) {
            document.getElementById("enemic").setAttribute("src", "battlearena-avatars/my_character-" + jugadorsAprop.enemies[i].image + ".png");
            trobat = true;
        }

        /* si estas mirando hacia la izquierda y tienes un jugador que lo muestre */
        if ((jugadorsAprop.enemies[i].x < jugador1.pos_x) && (jugadorsAprop.enemies[i].y == jugador1.pos_y) && (jugador1.direccion == "O")) {
            document.getElementById("enemic").setAttribute("src", "battlearena-avatars/my_character-" + jugadorsAprop.enemies[i].image + ".png");
            trobat = true;
        }

        /* si estas mirando hacia la derecha y tienes un jugador que lo muestre */
        if ((jugadorsAprop.enemies[i].x > jugador1.pos_x) && (jugadorsAprop.enemies[i].y == jugador1.pos_y) && (jugador1.direccion == "E")) {
            document.getElementById("enemic").setAttribute("src", "battlearena-avatars/my_character-" + jugadorsAprop.enemies[i].image + ".png");
            trobat = true;
        }
    }
    /* si no hay ningun jugador en un tu campo de visión que no muestre nada */
    if (!trobat) {
        document.getElementById("enemic").setAttribute("src", "");
    }
}

/*
 * @Finalitat: Buida el minimapa per posar caselles blanques
 * @Paràmetres: no
 * @Retorn: no
 */
function buidaMapa () {
    for (var i = 0; i < 40; i++) {
        for (var j = 0; j < 40; j++) {
            matrixMinimap[i][j] = 0;   
        }
    }
}

/*
 * @Finalitat: Omple i actualitza el minimapa
 * @Paràmetres: no
 * @Retorn: no
 */
function ompleMinimapa() {
    if(viu){
        /* declaramos la promesa de playersObjects donde nos cargara todos lo enemigos y objectos que haya en nuestro alrededor */
        playersObjects = new Promise (function (myResolve2, myReject2) {
            var status;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "http://battlearena.danielamo.info/api/playersobjects/" + group_token + "/" + token, true);
            xhr.onload = function () {
                status = xhr.status;
                if (status == 200) {
                    jugadorsAprop = JSON.parse(xhr.responseText);
                    console.log ("S'ha consultat la informació dels enemics i objectes");
                    myResolve2(jugadorsAprop);
                }
                else {
                    console.error(xhr.statusText);
                    myReject2(console.log("Error"));
                }
            };
            xhr.onerror = function () {
                console.error(xhr.statusText);
            };
            xhr.send();
            return status;
        })
        
        /* declaramos la promesa de map donde nos cargara todos lo enemigos que haya en el juego */
        map = new Promise (function (myResolve, myReject) {
            var status;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "http://battlearena.danielamo.info/api/map/" + group_token + "/" + token, true);
            xhr.onload = function () {
                status = xhr.status;
                if (status == 200) {
                    infoEnemics = JSON.parse(xhr.responseText);
                    console.log ("S'ha consultat la informació");
                    myResolve(infoEnemics);
                }
                else {
                    console.error(xhr.statusText);
                    myReject(console.log("Error"));
                }
            };
            xhr.onerror = function () {
                console.error(xhr.statusText);
            };
            xhr.send();
            return status;
        })
        
        buidaMapa ();
        map.then(function(value) {
            /* actualitzem el minimapa de enemics assignant un 1 a la casella */
            for(var i = 0; i < value.enemies.length; i++) {
                var x = value.enemies[i].x;
                var y = value.enemies[i].y;
                matrixMinimap[y][x] = 1;
            }

            /* actualitzem el minimapa d'objectes assignant un 2 a la casella */
            for (var i = 0; i < value.objects.length; i++) {
                var x = value.objects[i].x;
                var y = value.objects[i].y;
                matrixMinimap[y][x] = 2;
            }

            /* actualitzem la posicio del nostre jugador en el minimapa assignant un 3 */
            matrixMinimap[jugador1.pos_y][jugador1.pos_x] = 3;

            mostraMinimapa();
            mostraEnemicsAprop();
            mostrarEnemic();
            /* mostraObjectesAprop(); */
        },
        function(error) {console.log(error)}
        )
    }
}

/*
 * @Finalitat: Dibuixa la taula del minimapa en el fitxer html
 * @Paràmetres: no
 * @Retorn: no
 */
function mostraMinimapa(){
    var fullmap = '<table class="minimapa">';
    for(var i=matrixMinimap.length -1; i >= 0; i--) {
        fullmap += '<tr>';
        for(var j=0; j<matrixMinimap[i].length; j++) {
            /* en funcio del numero de la casella en l'array del minimapa pintem les caselles de diferent color */
            switch (matrixMinimap[i][j]) {
                case 0: fullmap += '<td class="cell-white"></td>'; break;
                case 1: fullmap += '<td class="cell-enemy-red"></td>'; break;
                case 2: fullmap += '<td class="cell-object-black"></td>'; break;
                case 3: fullmap += '<td class="cell-player1-blue"></td>'; break;
            }
        }
        fullmap += '</tr>';
    }
    fullmap += '</table>';
    document.getElementById('minimap').innerHTML = fullmap;
}

/*
 * @Finalitat: Mostra una taula amb els enmics i les seves característiques al voltant del jugador.
 * @Paràmetres: no
 * @Retorn: no
 */
function mostraEnemicsAprop () {
    var enemicsAprop = '<table class="table is-bordered is-striped is-narrow is-hoverable enemics-aprop">';
    enemicsAprop += '<tr><th>X</th><th>Y</th><th>Direccio</th><th>Vida</th></tr>';

    playersObjects.then(function (value) {
        for (var i = 0; i < value.enemies.length; i++) {
            enemicsAprop += "<tr><td>" + value.enemies[i].x + "</td><td>" + value.enemies[i].y + "</td><td>" + value.enemies[i].direction + "</td><td>" + value.enemies[i].vitalpoints + "</td></tr>";
        }
        enemicsAprop += '</table>';
        document.getElementById('tabla-enemics').innerHTML = enemicsAprop;
    },
        function(error) {console.log(error)}
    )
}

/*
 * @Finalitat: Dibuixa els objectes al minimapa
 * @Paràmetres: no
 * @Retorn: no
 */
/* function mostraObjectesAprop () {
    playersObjects();
    var objectesAprop = '<table class="table is-bordered is-striped is-narrow is-hoverable objectes-aprop">';
    objectesAprop += '<thead>Enemics</thead>';
    objectesAprop += '<tr><th>Nom Objecte</th><th>Atac</th><th>Defensa</th></tr>';
    for (var i = 0; i < jugadorsAprop.objects.length; i++) {
        objectesAprop += "<tr><td>" + objectesAprop.objects[i].nom_obj + "</td><td>" + objectesAprop.objects[i].valor_ataque + "</td><td>" + objectesAprop.objects[i].valor_defensa + "</td></tr>";
    }
    objectesAprop += '</table>';
    document.getElementById('tabla-objectes').innerHTML = objectesAprop;
} */