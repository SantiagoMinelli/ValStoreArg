// -------------------- Inicialización --------------------
// Array Carrito
let carrito = JSON.parse(localStorage.getItem('cart')) || [];

// Mostrar el carrito al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    displayCart();
    updateProductCount();
    console.log(carrito);
});

// Actualizar la cantidad de productos
function updateProductCount() {
    const cantidadElement = document.getElementById('cantidad-productos');
    if (cantidadElement) {
        cantidadElement.textContent = carrito.length;
    }
}

// Clase Producto
class Producto {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
}

// Calcular el año para el footer
document.getElementById("year").textContent = new Date().getFullYear();

// -------------------- Función para validar tarjeta --------------------
function validateCardNumber(cardNumber) {
    let sum = 0;
    let shouldDouble = false;

    // Recorremos el número de tarjeta de derecha a izquierda
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9; 
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;  
}

// -------------------- Funciones de Pago --------------------

// Mostrar el formulario de pago al hacer clic en "Comprar ahora"
document.getElementById('buyButton')?.addEventListener('click', openPaymentForm);

// Abrir el Formulario de Pago
function openPaymentForm() {
    toggleModal('paymentForm', true);
}

// Cerrar el formulario de pago sin realizar la compra
document.getElementById('closePaymentForm')?.addEventListener('click', () => toggleModal('paymentForm', false));

// Cerrar el formulario de pago al hacer clic en la X
document.getElementById('closePaymentFormUp')?.addEventListener('click', () => toggleModal('paymentForm', false));

// Formulario de pago (hacer la compra)
document.getElementById('payment-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    
    let cardNumber = document.getElementById('card-number').value.trim();
    let cardName = document.getElementById('card-name').value.trim();
    let expiryDate = document.getElementById('expiry-date').value.trim();
    let cvv = document.getElementById('cvv').value.trim();
    let dni = document.getElementById('dni').value.trim();

    if (!validateCardNumber(cardNumber)) {
        alert("Número de tarjeta inválido.");
        return;
    }

    if ([cardName, expiryDate, cvv, dni].includes("")) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    // Proceder con la compra
    toggleModal('paymentForm', false);
    carrito = [];
    localStorage.setItem('cart', JSON.stringify(carrito));
    displayCart();
    updateProductCount();
    openPurchaseModal();
});

// -------------------- Funciones para verificar si todos los campos están completos --------------------
document.querySelectorAll('#payment-form input').forEach(input => input.addEventListener('input', checkFormCompletion));

function checkFormCompletion() {
    const allFilled = [...document.querySelectorAll('#payment-form input')].every(input => input.value.trim() !== '');
    const cardNumber = document.getElementById('card-number').value.trim();
    const isCardValid = validateCardNumber(cardNumber);
    
    document.getElementById('buy').disabled = !(allFilled && isCardValid);
}

// -------------------- Funciones del Carrito --------------------
// Agregar un producto
function addToCart(productName, price) {
    const product = new Producto(productName, price);
    carrito.push(product);
    updateProductCount();
    displayCart();
    localStorage.setItem('cart', JSON.stringify(carrito));
}

// Mostrar los productos en la tabla
function displayCart() {
    var grid = document.getElementById('product-grid');
    // Asegurarse de que el grid exista para continuar
    if (!grid) return; 

    // Iniciarla vacía por defecto
    grid.innerHTML = '';

    if (carrito.length === 0) {
        grid.innerHTML = '<h2>No tienes productos en el carrito.</h2>';
    } else {
        // Variable total
        var total = 0;

        // Crear el encabezado
        var table = document.createElement('table');
        table.classList.add('cart-table');

        // Cargar encabezado
        var headerRow = document.createElement('tr');
        var headers = ['Producto', 'Precio', 'Acción'];
        headers.forEach(function(headerText) {
            var th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Agregar los productos a la tabla
        carrito.forEach(function(product, index) {
            var row = document.createElement('tr');

            // Columna Producto
            var productNameCell = document.createElement('td');
            var productName = document.createElement('h3');
            productName.textContent = product.name;
            productNameCell.appendChild(productName);

            // Columna Precio
            var productPriceCell = document.createElement('td');
            var productPrice = document.createElement('p');
            productPrice.textContent = '$' + product.price;
            productPriceCell.appendChild(productPrice);

            // Columna Acción (Eliminar)
            var actionCell = document.createElement('td');
            var removeButton = document.createElement('button');
            removeButton.textContent = 'Quitar';
            removeButton.classList.add('btn-remove');
            removeButton.addEventListener('click', function() {
                openModal(product, index);
            });
            actionCell.appendChild(removeButton);

            // Agregar los productos a la tabla
            row.appendChild(productNameCell);
            row.appendChild(productPriceCell);
            row.appendChild(actionCell);
            table.appendChild(row);

            // Acumular el precio total
            total += parseFloat(product.price);
        });

        // Agregar la tabla al grid
        grid.appendChild(table);

        // Agregar el total y el botón de compra ahora
        var totalRow = document.createElement('div');
        totalRow.classList.add('cart-total');
        totalRow.innerHTML = `
            <p>Total: $${total.toFixed(2)}</p>
            <button id="buyButton" class="btn-buy">Comprar ahora</button>
        `;
        grid.appendChild(totalRow);

        // Agregar el evento para la compra
        const buyButton = document.getElementById('buyButton');
        if (buyButton) {
            buyButton.addEventListener('click', function() {
                openPaymentForm();
            });
        }
    }
}

// Eliminar el producto del carrito
let productToRemove = null;
function openModal(product, index) {
    // Se almacena el producto con su indice para identificarlo
    productToRemove = { product, index };

    // Mostrar los detalles del producto a eliminar en el modal
    document.getElementById('modal-product-name-remove').textContent = product.name;
    document.getElementById('modal-price-remove').textContent = '$' + product.price;
    toggleModal('confirmationModalRemove', true);
}

// Confirmar la eliminación
const confirmRemove = document.getElementById('confirmRemove');
if (confirmRemove) {
    confirmRemove.addEventListener('click', function() {
        if (productToRemove) {
            // Eliminar el producto del array
            carrito.splice(productToRemove.index, 1);

            // Actualizar la cantidad en el enlace
            const cantidadElement = document.getElementById('cantidad-productos');
            if (cantidadElement) {
                cantidadElement.textContent = carrito.length;
            }
            displayCart();
            localStorage.setItem('cart', JSON.stringify(carrito));
            console.log(carrito);
        }
        closeModalRemove();
    });
}

// Cerrar el modal de eliminación
function closeModalRemove() {
    toggleModal('confirmationModalRemove', false);
}

// Mostrar el modal para agregar el producto
function confirmAddToCart(cardElement) {
    // Obtener los detalles del producto
    let productName = cardElement.querySelector('h2').textContent + " " + cardElement.querySelector('h3').textContent;
    let price = cardElement.querySelector('.precio').textContent;

    // Mostrar la información en el modal
    document.getElementById('modal-product-name').textContent = productName;
    document.getElementById('modal-price').textContent = price;

    // Mostrar el modal de confirmación de agregar producto
    toggleModal('confirmationModalAdd', true);

    // Agregar el producto al confirmar
    const confirmAdd = document.getElementById('confirmAdd');
    if (confirmAdd) {
        confirmAdd.onclick = function() {
            addToCart(productName, price);
            closeModalAdd();
            console.log(carrito);
        };
    }
}

// Cerrar el modal de agregar producto
function closeModalAdd() {
    toggleModal('confirmationModalAdd', false);
}

// -------------------- Funciones de Finalización de Compra --------------------

function openPurchaseModal() {
    toggleModal('purchaseModal', true);
}

document.getElementById('closePurchaseModal')?.addEventListener('click', function() {
    toggleModal('purchaseModal', false);
    carrito = [];
    localStorage.setItem('cart', JSON.stringify(carrito));
    displayCart();
});

// -------------------- Funciones Visuales Adicionales --------------------
// Toggle para mostrar u ocultar modales
function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = show ? 'block' : 'none';
    }
}

// Función para mostrar secciones específicas
function showSections(sectionsToShow) {
    // Ocultar todas las secciones
    const allSections = document.querySelectorAll('.section');
    allSections.forEach(sec => sec.style.display = 'none');
    sectionsToShow.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
        }
    });
}

// Mostrar solo las tiendas al iniciar
window.onload = function() {
    showSections(['tienda', 'tienda-2', 'tienda-3', 'tienda-4']);
};

// Mostrar solo la sección especificada
function showSection(section) {
    showSections([section]);
}

// Animación del contenido de la tarjeta (Mercado Nocturno)
function revealContent(cardElement) {
    const cardInner = cardElement.querySelector('.card-inner');

    // Asegurarse de que solo se haga una vez
    if (cardInner && !cardInner.classList.contains('revealed')) {
        cardInner.classList.add('revealed');
    }
}
