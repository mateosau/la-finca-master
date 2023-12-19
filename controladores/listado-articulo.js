import { obtenerarticulos } from '../modelos/articulos';

const url = './api/datos.php?tabla=casas';

// alerta
const alerta = document.querySelector('#alerta');

// login de la navegacion
const navLogin = document.querySelector('#nav-login')


// Formulario
const formulario = document.querySelector('#formulario');
const formularioModal = new bootstrap.Modal(document.querySelector("#formularioModal"));
const btnNuevo = document.querySelector('#btnNuevo');
const btnGuardar = document.querySelector('#btnGuardar');


// Input
const inputUbicacion = document.querySelector('#ubicacion');
const inputNombre = document.querySelector('#nombre');
const inputMetros = document.querySelector('#metros');
const inputPrecio = document.querySelector('#precio');
const inputImagen = document.querySelector('#imagen');
const inputHabitaciones = document.querySelector('#habitaciones');
const inputBanios = document.querySelector('#banios');

//imagen del formulario
const frmImagen = document.querySelector("#frmimagen");

// variables
let accion = '';
let id;

// variable de iniciar de sesison
let usuario = '';
let logueado = false;

//control de usuario
const controlUsuario = () => {  // function controUsuario (){}
    if (sessionStorage.getItem('usuario')) {
        usuario = sessionStorage.getItem('usuario');
        logueado = true;
    }

    /*
    if (logueado) {
        navLogin.setAttribute('href', '#');
        navLogin.innerHTML = 'Cerrar sesion';
        btnNuevo.style.display = 'inline';
        navLogin.addEventListener('click', () => {
            sessionStorage.setItem('usuario', '');
            logueado = false;
            window.location.reload();
        })
    } else {
        navLogin.setAttribute('href', 'login.html');
        navLogin.innerHTML = 'Iniciar sesion';
        btnNuevo.style.display = 'none';
    }
    */
}


document.addEventListener('DOMContentLoaded', () => {
    controlUsuario();
    mostrarArticulos();
});

async function mostrarArticulos() {
    const articulos = await obtenerarticulos();
    console.log(articulos);
    const listado = document.querySelector("#listado"); // = getElementById("listado")
    listado.innerHTML = '';
    for (let articulo of articulos) {
        if (!logueado) {
            listado.innerHTML += `
            <div class="col-lg-3 col-md-3 wow fadeInUp" data-wow-delay="0.1s">
                <div class="property-item rounded overflow-hidden">
                    <div class="position-relative overflow-hidden">
                        <a href="z-casa-mega.html"><img class="img-fluid imagen" src="img/${articulo.imagen ?? 'nodisponible.png'}" alt=""></a>
                        <div class="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">En Venta</div>
                        <div class="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">Apartamento</div>
                    </div>
                    <div class="p-4 pb-0">
                        <h5 class="text-primary mb-3"><span name="spanprecio">${articulo.precio}</span></h5>                                
                        <a class="d-block h5 mb-2" href=""><span name="spannombre">${articulo.nombre}</span></a>
                        <p><i class="fa fa-map-marker-alt text-primary me-2"></i><span name="spanubicacion">${articulo.ubicacion}</span></p>
                    </div>
                    <div class="d-flex border-top">
                        <small class="flex-fill text-center border-end py-2"><i class="fa fa-ruler-combined text-primary me-2"></i><span name="spanmetros">${articulo.metros}</span></small>
                        <small class="flex-fill text-center border-end py-2"><i class="fa fa-bed text-primary me-2"></i><span name="spanhabitaciones">${articulo.habitaciones}</span></small>
                        <small class="flex-fill text-center py-2"><i class="fa fa-bath text-primary me-2"></i><span name="spanbanios">${articulo.banios}</span></small>
                    </div>
                    <div class="d-flex justify-content-center">
                        <input type="hidden" class="idArticulo" value="${articulo.id}">
                        <input type="hidden" class="imagenArticulo" value="${articulo.imagen ?? 'nodisponible.png'}">
                        <a class="btnEditar btn btn-primary">Editar</a>
                        <a class="btnBorrar btn btn-danger">Eliminar</a>
                    </div>
                </div>
            </div>
            `;

        } else {
            listado.innerHTML += `<div class="col-lg-3 col-md-3 wow fadeInUp" data-wow-delay="0.1s">
            <div class="property-item rounded overflow-hidden">
                <div class="position-relative overflow-hidden">
                    <a href="z-casa-mega.html"><img class="img-fluid imagen" src="img/${articulo.imagen ?? 'nodisponible.png'}" alt=""></a>
                    <div class="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">En Venta</div>
                    <div class="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3">Apartamento</div>
                </div>
                <div class="p-4 pb-0">
                    <h5 class="text-primary mb-3"><span name="spanprecio">${articulo.precio}</span></h5>                                
                    <a class="d-block h5 mb-2" href=""><span name="spannombre">${articulo.nombre}</span></a>
                    <p><i class="fa fa-map-marker-alt text-primary me-2"></i><span name="spanubicacion">${articulo.ubicacion}</span></p>
                </div>
                <div class="d-flex border-top">
                    <small class="flex-fill text-center border-end py-2"><i class="fa fa-ruler-combined text-primary me-2"></i><span name="spanmetros">${articulo.metros}</span></small>
                    <small class="flex-fill text-center border-end py-2"><i class="fa fa-bed text-primary me-2"></i><span name="spanhabitaciones">${articulo.habitaciones}</span></small>
                    <small class="flex-fill text-center py-2"><i class="fa fa-bath text-primary me-2"></i><span name="spanbanios">${articulo.banios}</span></small>
                </div>
            </div>
        </div>`;
        }
    }
}

/**
 * Ejecutamos el evento submit al formulario
 */
btnGuardar.addEventListener('click', (e) => {
    console.log(accion);
    e.preventDefault();      // Prevenimos la accion por defecto
    const datos = new FormData(formulario);  // Guardamos los datos del formulario
    switch (accion) {
        case "insertar":
            fetch(`${url}&accion=insertar`, {
                method: 'POST',
                body: datos
            })
                .then(res => res.json())
                .then(data => {
                    insertarAlerta(data, 'success');
                    mostrarArticulos();
                });
            break;
        case "actualizar":
            fetch(`${url}&accion=actualizar&id=${id}`, {
                method: 'POST',
                body: datos
            })
                .then(res => res.json())
                .then(data => {
                    insertarAlerta(data, 'success');
                    mostrarArticulos();
                });
            break;
    }
})

/**
 *  Ejecuta el evento clic del boton nuevo
 */
btnNuevo.addEventListener('click', () => {
    //limpiamos los inputs
    inputUbicacion.value = null;
    inputNombre.value = null;
    inputMetros.value = null;
    inputPrecio.value = null;
    inputHabitaciones.value = null;
    inputBanios.value = null;
    inputImagen.value = null;
    frmImagen.src = './img/nodisponible.png';

    //mostramos el formulario
    formularioModal.show();

    accion = 'insertar';
})

/**
 * Define el mensaje de alerta
 * @param mensaje el mensaje a mostrar
 * @param tipo el tipo de aleta
 */
const insertarAlerta = (mensaje, tipo) => {
    const envoltorio = document.createElement('div');
    envoltorio.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible" role="alert">
       <div>${mensaje}</div>
       <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `;
    alerta.append(envoltorio);
}

/**
 * determina en que elemento se realiza un evento
 * @param elemento el elemento al que se realiza el evento
 * @param evento el evento realizado
 * @param selector el selector seleccionado
 * @param manejador metodo que ejecutamos el evento 
 */
const on = (elemento, evento, selector, manejador) => {
    elemento.addEventListener(evento, e => {
        if (e.target.closest(selector)) {
            manejador(e);
        }
    })
}

/**
 * Ejecuta el clic de btnEditar
 */
on(document, 'click', '.btnEditar', e => {
    const cardFooter = e.target.parentNode; // Elemento padre del boton
    // Obtener los datos del articulo seleccionado
    id = cardFooter.querySelector('.idArticulo').value;
    const ubicacion = cardFooter.parentNode.querySelector('span[name=spanubicacion]').innerHTML;
    const nombre = cardFooter.parentNode.querySelector('span[name=spannombre]').innerHTML;
    const metros = cardFooter.parentNode.querySelector('span[name=spanmetros]').innerHTML;
    const precio = cardFooter.parentNode.querySelector('span[name=spanprecio]').innerHTML;
    const habitaciones = cardFooter.parentNode.querySelector('span[name=spanhabitaciones]').innerHTML;
    const banios = cardFooter.parentNode.querySelector('span[name=spanbanios]').innerHTML;
    const imagen = cardFooter.parentNode.querySelector('.imagenArticulo').value;

    //asignamos los valores a los input
    inputUbicacion.value = ubicacion;
    inputNombre.value = nombre;
    inputMetros.value = metros;
    inputPrecio.value = precio;
    inputHabitaciones.value = habitaciones;
    inputBanios.value = banios;
    //inputImagen.value = imagen;
    frmImagen.src = `./img/${imagen}`;

    //mostramos el formulario
    formularioModal.show();

    accion = 'actualizar';

});

/**
 * Evento click del boton borrar
 */
on(document, 'click', '.btnBorrar', e => {
    const cardFooter = e.target.parentNode;
    id = cardFooter.querySelector('.idArticulo').value;
    const nombre = cardFooter.parentNode.querySelector("span[name=spannombre]").innerHTML;
    let aceptar = confirm(`¿Realmente desea eliminar a ${nombre}?`)
    if (aceptar) {
        console.log(`${nombre} Eliminado`);
        fetch(`${url}&accion=eliminar&id=${id}`)
            .then(res => res.json())
            .then(data => {
                insertarAlerta(data, 'danger');
                mostrarArticulos();
            });
    }

});