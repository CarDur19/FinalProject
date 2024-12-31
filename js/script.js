   // Configuración de productos con stock y descuentos
const productos = {
    laptop: { 
        nombre: 'Laptop', 
        precio: 1000, 
        stock: 8,
        descuento: 0.1  // 10% de descuento
    },
    celular: { 
        nombre: 'Celular', 
        precio: 500, 
        stock: 15,
        descuento: 0.05  // 5% de descuento
    },
    tablet: { 
        nombre: 'Tablet', 
        precio: 300, 
        stock: 10,
        descuento: 0.25
    },
    iphone: {
        nombre: 'Iphone',
        precio: 800,
        stock:  12 ,
        descuento: 0.08
    },
    pcgamer: {
        nombre: 'Pc Gamer',
        precio: 1200,
        stock: 5,
        descuento: 0.2
    },
    silla: {
        nombre: 'Silla',
        precio: 100,
        stock: 30,
        descuento: 0
    }
};

// Constante para el IVA
const IVA = 0.21;  // 21% de IVA

// Inicializar el carrito al cargar la página
document.addEventListener('DOMContentLoaded', cargarCarrito);
// Validar si es que hay productos en el carrito para mostrarlo o no
document.addEventListener('DOMContentLoaded', mirarCarrito);

function mirarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        const model = document.getElementById('carrito');
       ocultarCarro();
    } else {
        const model = document.getElementById('carrito');
        mostrarCarro();
    }
}

function agregarAlCarrito(nombre, precio, productoKey) {

    // Obtener el producto específico
    const producto = productos[productoKey];
    // Validar stock
    if (producto.stock <= 0) {
        alert('¡Producto agotado!');
        return;
    }

    // Obtener el carrito actual del localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Agregar nuevo producto
    carrito.push({ 
        nombre: producto.nombre, 
        precio: producto.precio,
        productoKey,
    });
    
    // Reducir stock
    producto.stock--;
    document.getElementById(`stock-${productoKey}`).textContent = producto.stock;
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizar vista del carrito
    renderizarCarrito();
    mostrarCarro();
}

function renderizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const subtotalCarrito = document.getElementById('subtotal-carrito');
    const descuentoCarrito = document.getElementById('descuento-carrito');
    const ivaCarrito = document.getElementById('iva-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Limpiar lista anterior
    listaCarrito.innerHTML = '';
    
    // Totales iniciales
    let subtotal = 0;
    let descuentoTotal = 0;
    
    // Renderizar cada producto
    carrito.forEach((producto, index) => {
        const productoInfo = productos[producto.productoKey];
        const li = document.createElement('li');
        
        // Calcular descuento individual
        const descuentoProducto = productoInfo.descuento * producto.precio;
        const precioConDescuento = producto.precio - descuentoProducto;
        
        li.innerHTML = `
            ${producto.nombre} - $${producto.precio} 
            ${productoInfo.descuento > 0 ? 
                `<span class="descuento">(Desc. ${(productoInfo.descuento * 100).toFixed(0)}%: 
                -$${descuentoProducto.toFixed(2)})</span>` 
                : ''}
        `;
        
        // Botón para eliminar producto
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.onclick = () => eliminarDelCarrito(index);
        
        li.appendChild(botonEliminar);
        listaCarrito.appendChild(li);
        
        // Sumar al subtotal y descuentos
        subtotal += producto.precio;
        descuentoTotal += descuentoProducto;
    });
    
    // Calcular IVA
    const ivaTotal = (subtotal - descuentoTotal) * IVA;
    const total = subtotal - descuentoTotal + ivaTotal;
    
    // Actualizar totales
    subtotalCarrito.textContent = subtotal.toFixed(2);
    descuentoCarrito.textContent = descuentoTotal.toFixed(2);
    ivaCarrito.textContent = ivaTotal.toFixed(2);
    totalCarrito.textContent = total.toFixed(2);
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Recuperar el producto para devolver stock
    const producto = productos[carrito[index].productoKey];
    producto.stock++;
    document.getElementById(`stock-${carrito[index].productoKey}`).textContent = producto.stock;
    
    // Eliminar producto por índice
    carrito.splice(index, 1);
    
    // Actualizar localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Renderizar de nuevo
    renderizarCarrito();
}

function vaciarCarrito() {
    // Restaurar stock de todos los productos
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.forEach(item => {
        const producto = productos[item.productoKey];
        producto.stock++;
        document.getElementById(`stock-${item.productoKey}`).textContent = producto.stock;
    });
    
    // Limpiar localStorage
    localStorage.removeItem('carrito');
    
    // Renderizar
    renderizarCarrito();

    ocultarCarro();
}

function cargarCarrito() {
    // Cargar carrito al iniciar la página
    renderizarCarrito();
}

// Funciones de Checkout
function mostrarCheckout() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Validar que hay productos en el carrito
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    // Mostrar modal de checkout
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'flex';
    
    // Actualizar totales en el modal
    const subtotal = parseFloat(document.getElementById('subtotal-carrito').textContent);
    const descuento = parseFloat(document.getElementById('descuento-carrito').textContent);
    const iva = parseFloat(document.getElementById('iva-carrito').textContent);
    const total = parseFloat(document.getElementById('total-carrito').textContent);
    
    document.getElementById('modal-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('modal-descuento').textContent = descuento.toFixed(2);
    document.getElementById('modal-iva').textContent = iva.toFixed(2);
    document.getElementById('modal-total').textContent = total.toFixed(2);
}

function realizarCompra() {
    // Simular compra
    alert('¡Compra realizada con éxito!');
    
    // Vaciar carrito
    localStorage.removeItem('carrito');
    cerrarCheckout();
    renderizarCarrito();
    ocultarCarro();
}

function cerrarCheckout() {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'none';
}

/* añadido para que el Carrito tambien este escondido */

function mostrarCarro() {
    const model = document.getElementById('carrito');
    model.style.display = 'block';
}
function ocultarCarro(){
    const model = document.getElementById('carrito');
    model.style.display = 'none';
}
