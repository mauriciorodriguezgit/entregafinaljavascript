

document.addEventListener('DOMContentLoaded', traerProductos);
const contenedor = document.querySelector('#contenedor');
let carrito = [];
const carritoContenedor = document.querySelector('#carritoContenedor');
const vaciarCarrito = document.querySelector('#vaciarCarrito');
const precioTotal = document.querySelector('#precioTotal');
const botonFinalizar = document.querySelector('#finalizar');
const thead = document.querySelector('#thead');
const tbody = document.querySelector('.tbody');
const parrafoTotal = document.querySelector('#total');
const gracias = document.querySelector('.gracias');
const tituloprincipal = document.querySelector('.titulo');

// se guarda el carrito en el DOM
document.addEventListener('DOMContentLoaded', () => {
    carrito = JSON.parse(localStorage.getItem('carritoGuardado')) || [];
    mostrarCarrito();
});

// se vacía el carrito por completo
vaciarCarrito.addEventListener('click', () => {
    carrito.length = [];
    mostrarCarrito();
});

async function traerProductos() {
    const url = 'https://fakestoreapi.com/products';
    try {
        const resultados = await fetch(url);
        const respuestas = await resultados.json();
        traemelosProductos(respuestas);
    } catch (error) {
        console.log(error);
    }
}

function traemelosProductos(Productos) {
    Productos.forEach((prod) => {
        const { id, title, price, category, description, image } = prod;
        contenedor.innerHTML += `<div class="card" style="width: 18rem;">
            <img src="${image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">Descripción: ${description}.</p>
                <p class="card-subtitle mb-2 text-body-secondary">Precio: ${price}</p>
                <p class="card-subtitle mb-2 text-body-secondary">Categoría: ${category}</p>
                <button class="btn btn-primary" onclick="agregarProducto(${id})">AGREGAR</button>
            </div>
        </div>`;
    });
}

// Trae los productos de a 1
async function traerProducto(id) {
    const url = `https://fakestoreapi.com/products/${id}`;
    try {
        const resultado = await fetch(url);
        const respuesta = await resultado.json();
        traemelosProductos(respuesta);
    } catch (error) {
        console.log(error);
    }
}

const agregarProducto = async (id) => {
    const url = `https://fakestoreapi.com/products/${id}`;
    try {
        const response = await fetch(url);
        const product = await response.json();
        const buscarProducto = carrito.find((prod) => prod.id === product.id);
        if (!buscarProducto) {
            carrito.push({
                id: product.id,
                cantidad: 1,
                price: product.price,
                image: product.image,
                title: product.title,
            });
        } else {
            buscarProducto.cantidad++;
        }
    } catch (error) {
        console.log(error);
    }
    mostrarCarrito();
};

const mostrarCarrito = () => {
    const modalBody = document.querySelector('.modal-body');
    const total = document.querySelector('#precioTotal');

    modalBody.innerHTML = '';
    carrito.forEach((prod) => {
        const { id, title, price, image, cantidad } = prod;
        const row = document.createElement('div');
        row.classList.add('row', 'my-3');
        row.innerHTML = `
            <div class="col-md-3">
                <img src="${image}" class="img-fluid" alt="Producto">
            </div>
            <div class="col-md-9">
                <div class="d-flex justify-content-between align-items-center">
                    <h6>${title}</h6>
                    <span class="badge bg-primary">$${price}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <span>Cantidad: ${cantidad}</span>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${id})">Eliminar</button>
                </div>
            </div>
        `;
        modalBody.appendChild(row);
    });

    total.innerHTML = calcularTotal();

    localStorage.setItem('carritoGuardado', JSON.stringify(carrito));
    carritoContenedor.textContent = `carrito-${calcularCantidad()}`;
};

const eliminarProducto = (id) => {
    const productoEliminado = carrito.find((prod) => prod.id === id);
    productoEliminado.cantidad--;
    if (productoEliminado.cantidad === 0) {
        const indice = carrito.indexOf(productoEliminado);
        carrito.splice(indice, 1);
    }
    mostrarCarrito();
};

const calcularTotal = () => {
    let total = 0;
    carrito.forEach((prod) => {
        const { price, cantidad } = prod;
        total += price * cantidad;
    });
    return total.toFixed(2);
};

const calcularCantidad = () => {
    let cantidad = 0;
    carrito.forEach((prod) => {
        cantidad += prod.cantidad;
    });
    return cantidad;
};

botonFinalizar.addEventListener('click', () => {
    if (carrito.length === 0) {
        Swal.fire('Oops...', 'El carrito está vacío', 'error');
    } else {
        Swal.fire({
            title: '¡Gracias por tu compra!',
            text: 'Tu pedido fue recibido y será procesado',
            icon: 'success',
            confirmButtonText: 'Aceptar',
        });
        carrito = [];
        mostrarCarrito();
    }
});




