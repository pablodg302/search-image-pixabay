
const resultado = document.querySelector('#resultado');
const paginacionDiv = document.querySelector('#paginacion');
const btnClean = document.querySelector('.btn-clean');

let terminoBusqueda;
let paginaActual = 1;
let totalPaginas;
let iteradorSiguiente;
let cantidadPorPag = 30;
const selectPag = document.getElementById('cant-por-pag');

document.addEventListener('DOMContentLoaded', () => {
    buscarImagenes()
})

document.addEventListener('click', (e) => {
    e.preventDefault()
    console.log(e.target)
    if(e.target.classList.contains('popular-search')){
        terminoBusqueda = e.target.getAttribute('value');

        console.log(terminoBusqueda)
        buscarImagenes()
    }
})

selectPag.addEventListener('change', ()=> {
    cantidadPorPag = selectPag.value;
})
window.onload = () => {
    const formulario = document.querySelector('#formulario');
    formulario.addEventListener('submit', validarFormulario);
    paginacionDiv.addEventListener('click', direccionPaginacion);
};


function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === '') {
        // mensaje de error
        mostrarAlerta('Agrega un término de búsqueda');
        return;
    }
    buscarImagenes();
}


// Muestra una alerta de error o correcto
function mostrarAlerta(mensaje) {
    const alerta = document.querySelector('.bg-red-100');
    if(!alerta) {
        const alerta = document.createElement('p');

        alerta.classList.add('bg-red-100', "border-red-400", "text-red-700", "px-4", "py-3", "rounded",  "max-w-lg", "mx-auto", "mt-6", "text-center" );
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
    
        formulario.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}


// Busca las imagenes en una API
function buscarImagenes() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
    spinnerLoaded()
    totalPaginas = '';
    iteradorSiguiente = '';
    
    
    
    if(terminoBusqueda === undefined){
        terminoBusqueda = 'landscape';
    }else{
        const terminoBusqueda = document.querySelector('#termino').value;
    }

    const key = '21591541-599aa489255915e093161288e';
    const url = `https://pixabay.com/api/?key=${key}&q=${terminoBusqueda}&per_page=${cantidadPorPag}&page=${paginaActual}`;

    fetch(url) 
        .then(respuesta => respuesta.json())
        .then( resultado => {
            totalPaginas = parseInt( Math.ceil( resultado.totalHits / cantidadPorPag ))
            // totalPaginas = calcularPaginas(resultado.totalHits);

            console.log(resultado.totalHits)

            mostrarImagenes(resultado.hits);
        });


}

function mostrarImagenes(imagenes, paginas ) {

    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
    const imgList = document.createElement('div');
    imgList.classList.add('imgList')

    imagenes.forEach( imagen => {

        const { likes, views, previewURL, largeImageURL } = imagen;
        imgList.innerHTML += `
            <div class="card-img rounded">
                <a href=${largeImageURL} 
                rel="noopener noreferrer" 
                target="_blank" class="w-full block">
                    <div class="bg-black">
                        <div class="p-2 text-center card-text-content">
                            <div class="flex justify-evenly">
                                <span class="card-text text-xs"><i class="fas fa-heart"></i> ${likes} Me Gusta</span>
                                <span class="card-text text-xs"><i class="far fa-eye"></i>  ${views}  Vistas  </span>
                            </div>
                        </div>
                        <img class="w-full" src=${previewURL} alt={tags} />
                    </div>
                </a>
            </div>
            `;
    });

    resultado.appendChild(imgList)


    if(!iteradorSiguiente) {
        mostrarPaginacion();
    }
 
}
function calcularPaginas(total) {
    return parseInt( Math.ceil( total / 30 ));
}

function mostrarPaginacion() {
    // recorrer el iterador
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }
    iteradorSiguiente = crearPaginacion(totalPaginas);

    const listPag = document.createElement('div');
    listPag.classList.add('w-full', 'list-pag');
    paginacionDiv.appendChild(listPag)
    while( true ) {
        const { value, done } = iteradorSiguiente.next();

        if(done) return;

        // Crear botón de sig
        const botonSiguiente = document.createElement('a');
        botonSiguiente.href = "#";
        botonSiguiente.dataset.pagina = value;
        botonSiguiente.textContent = value;
        botonSiguiente.classList.add('siguiente', 'bg-gray-200', 'px-3', 'py-1', 'mr-2', 'mb-10', 'font-md', 'uppercase', 'rounded', 'hover:bg-gray-400');
        listPag.appendChild(botonSiguiente);
    }
}



// Crear el generador
function *crearPaginacion(total) {
    console.log(total);
    for( let i = 1; i <= total; i++) {
        yield i;
    }
}

function direccionPaginacion(e) {
    if(e.target.classList.contains('siguiente')) {

        paginaActual= Number( e.target.dataset.pagina);
        buscarImagenes();
        formulario.scrollIntoView();
    }
}


function spinnerLoaded(){
    const spinner = document.createElement('div');
    spinner.classList.add('flex', 'justify-center')
    spinner.innerHTML = `
    <div class="sk-fading-circle">
        <div class="sk-circle1 sk-circle"></div>
        <div class="sk-circle2 sk-circle"></div>
        <div class="sk-circle3 sk-circle"></div>
        <div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div>
        <div class="sk-circle6 sk-circle"></div>
        <div class="sk-circle7 sk-circle"></div>
        <div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div>
        <div class="sk-circle10 sk-circle"></div>
        <div class="sk-circle11 sk-circle"></div>
        <div class="sk-circle12 sk-circle"></div>
    </div>
    `
    resultado.appendChild(spinner);
    
}