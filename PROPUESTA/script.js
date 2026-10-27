// ==========================================
// ARBOTRACK
// Sistema de identificación de árboles
// ==========================================


let arboles =
    JSON.parse(
        localStorage.getItem("arboles")
    ) || [];


const formulario =
    document.getElementById("formArbol");

const contenedor =
    document.getElementById(
        "contenedorArboles"
    );

const buscador =
    document.getElementById("buscador");


// ==========================================
// REGISTRAR ÁRBOL
// ==========================================

formulario.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const nuevoArbol = {

            id:
                "ARB-" +
                String(
                    obtenerSiguienteId()
                ).padStart(3, "0"),

            nombre:
                document
                .getElementById("nombre")
                .value,

            cientifico:
                document
                .getElementById("cientifico")
                .value,

            ubicacion:
                document
                .getElementById("ubicacion")
                .value,

            edad:
                document
                .getElementById("edad")
                .value,

            estado:
                document
                .getElementById("estado")
                .value,

            observaciones:
                document
                .getElementById("observaciones")
                .value,

            fecha:
                new Date()
                .toLocaleDateString("es-MX")

        };


        arboles.push(nuevoArbol);

        guardar();

        formulario.reset();

        mostrarArboles();

        alert(
            "🌳 Árbol registrado correctamente."
        );
    }
);


// ==========================================
// GENERAR ID
// ==========================================

function obtenerSiguienteId() {

    if (arboles.length === 0) {
        return 1;
    }

    const numeros =
        arboles.map(
            arbol =>
                parseInt(
                    arbol.id.replace(
                        "ARB-",
                        ""
                    )
                )
        );

    return Math.max(...numeros) + 1;
}


// ==========================================
// GUARDAR
// ==========================================

function guardar() {

    localStorage.setItem(
        "arboles",
        JSON.stringify(arboles)
    );
}


// ==========================================
// MOSTRAR ÁRBOLES
// ==========================================

function mostrarArboles(
    filtro = ""
) {

    contenedor.innerHTML = "";


    const resultados =
        arboles.filter(arbol => {

            const texto =
                (
                    arbol.nombre +
                    arbol.cientifico +
                    arbol.id +
                    arbol.ubicacion
                ).toLowerCase();

            return texto.includes(
                filtro.toLowerCase()
            );
        });


    if (resultados.length === 0) {

        contenedor.innerHTML = `
            <div style="
                text-align:center;
                padding:50px;
                color:#64748b;
            ">
                <div style="font-size:50px;">
                    🌱
                </div>

                <h3>
                    No hay árboles registrados
                </h3>

                <p>
                    Registra el primer árbol
                    utilizando el formulario.
                </p>
            </div>
        `;

        actualizarEstadisticas();

        return;
    }


    resultados.forEach(arbol => {

        const tarjeta =
            document.createElement(
                "div"
            );

        tarjeta.className =
            "tree-card";


        let claseEstado =
            "good";


        if (
            arbol.estado ===
            "Regular"
        ) {

            claseEstado =
                "regular";

        }

        if (
            arbol.estado ===
            "Necesita atención"
        ) {

            claseEstado =
                "attention";
        }


        tarjeta.innerHTML = `

            <div>

                <span class="tree-id">
                    ${arbol.id}
                </span>

                <h3>
                    🌳 ${arbol.nombre}
                </h3>

                <div class="tree-info">

                    <div>
                        🔬
                        <strong>
                            Científico:
                        </strong>

                        ${arbol.cientifico}
                    </div>

                    <div>
                        📍
                        <strong>
                            Ubicación:
                        </strong>

                        ${arbol.ubicacion}
                    </div>

                    <div>
                        🎂
                        <strong>
                            Edad:
                        </strong>

                        ${arbol.edad}
                        años
                    </div>

                    <div>
                        ❤️
                        <strong>
                            Estado:
                        </strong>

                        <span
                            class="status ${claseEstado}"
                        >
                            ${arbol.estado}
                        </span>
                    </div>

                    <div>
                        📅
                        <strong>
                            Registro:
                        </strong>

                        ${arbol.fecha}
                    </div>

                    <div>
                        📝
                        <strong>
                            Observaciones:
                        </strong>

                        ${arbol.observaciones ||
                        "Sin observaciones"}
                    </div>

                </div>


                <button
                    class="btn-delete"
                    onclick="
                        eliminarArbol('${arbol.id}')
                    "
                >
                    🗑 Eliminar registro
                </button>

            </div>


            <div class="qr-container">

                <div
                    class="qr"
                    id="qr-${arbol.id}"
                ></div>

                <p>
                    ESCANEA EL QR
                </p>

            </div>

        `;


        contenedor.appendChild(
            tarjeta
        );


        // ==================================
        // CREAR QR
        // ==================================

        crearQR(arbol);

    });


    actualizarEstadisticas();
}


// ==========================================
// CREAR QR
// ==========================================

function crearQR(arbol) {

    const elemento =
        document.getElementById(
            `qr-${arbol.id}`
        );


    /*
        Esta URL identifica al árbol.

        Si el proyecto está publicado,
        puedes cambiar "ficha.html" por
        la dirección real de tu página.
    */

    const informacion =

        window.location.origin +
        window.location.pathname
        .replace(
            "index.html",
            "ficha.html"
        ) +

        "?id=" +
        encodeURIComponent(
            arbol.id
        );


    new QRCode(
        elemento,
        {
            text: informacion,

            width: 100,

            height: 100,

            colorDark: "#14532d",

            colorLight: "#ffffff",

            correctLevel:
                QRCode.CorrectLevel.H
        }
    );
}


// ==========================================
// ELIMINAR
// ==========================================

function eliminarArbol(id) {

    const confirmar =
        confirm(
            "¿Deseas eliminar este registro?"
        );


    if (!confirmar) {
        return;
    }


    arboles =
        arboles.filter(
            arbol =>
                arbol.id !== id
        );


    guardar();

    mostrarArboles();
}


// ==========================================
// BUSCAR
// ==========================================

buscador.addEventListener(
    "input",
    function() {

        mostrarArboles(
            this.value
        );

    }
);


// ==========================================
// ESTADÍSTICAS
// ==========================================

function actualizarEstadisticas() {

    document
        .getElementById(
            "totalArboles"
        )
        .textContent =
        arboles.length;


    document
        .getElementById(
            "arbolesBuenos"
        )
        .textContent =

        arboles.filter(
            arbol =>
                arbol.estado ===
                "Bueno"
        ).length;


    const lugares =
        new Set(
            arboles.map(
                arbol =>
                    arbol.ubicacion
                    .toLowerCase()
            )
        );


    document
        .getElementById(
            "ubicaciones"
        )
        .textContent =
        lugares.size;
}


// ==========================================
// INICIAR
// ==========================================

mostrarArboles();