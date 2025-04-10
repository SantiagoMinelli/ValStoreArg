// -------------------- Inicialización --------------------
// Array Carrito
let carrito = JSON.parse(localStorage.getItem('cart')) || [];

// Cargado de la página
document.addEventListener("DOMContentLoaded", () => {
    displayCart();       
    updateProductCount();
    console.log(carrito);
    document.getElementById("year").textContent = new Date().getFullYear(); // Footer
});

// -------------------- Actualizar cantidad de productos --------------------
const updateProductCount = () => {
    const cantidadElement = document.getElementById('cantidad-productos');
    if (cantidadElement) {
        cantidadElement.textContent = carrito.length;
    }
};

// -------------------- Clase Producto --------------------
class Producto {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
}

// -------------------- Validación de tarjeta --------------------
const validateCardNumber = (cardNumber) => {
    let sum = 0;
    let shouldDouble = false;
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
};

// -------------------- Funciones de Pago --------------------
const openPaymentForm = () => toggleModal('paymentForm', true);
document.getElementById('closePaymentForm')?.addEventListener('click', () => toggleModal('paymentForm', false));
document.getElementById('closePaymentFormUp')?.addEventListener('click', () => toggleModal('paymentForm', false));

document.getElementById('payment-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const cardNumber = document.getElementById('card-number').value.trim();
    const cardName = document.getElementById('card-name').value.trim();
    const expiryDate = document.getElementById('expiry-date').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const dni = document.getElementById('dni').value.trim();

    if (!validateCardNumber(cardNumber)) {
        alert("Número de tarjeta inválido.");
        return;
    }

    if ([cardName, expiryDate, cvv, dni].some(val => val === '')) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    carrito = [];
    localStorage.setItem('cart', JSON.stringify(carrito));
    toggleModal('paymentForm', false);
    displayCart();
    updateProductCount();

    // -------------------- Finalizar compra --------------------
    Swal.fire({
        title: "¡Compra realizada con éxito!",
        text: "Muchas gracias por comprar con ValStore ARG",
        icon: "success",
        showClass: {
        popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
        `
        },
        hideClass: {
        popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
        `
        },
        showConfirmButton: false,
        timer: 3500
    });

    window.onload = () => {
        showSections(['tienda', 'tienda-2', 'tienda-3', 'tienda-4']);
    };
});

// Validación de que los campos estén completos
document.querySelectorAll('#payment-form input').forEach(input => 
    input.addEventListener('input', () => checkFormCompletion())
);

const checkFormCompletion = () => {
    const inputs = [...document.querySelectorAll('#payment-form input')];
    const allFilled = inputs.every(input => input.value.trim() !== '');
    const cardNumber = document.getElementById('card-number').value.trim();
    const isCardValid = validateCardNumber(cardNumber);
    document.getElementById('buy').disabled = !(allFilled && isCardValid);
};

// -------------------- Mostrar productos en el carrito --------------------
const displayCart = () => {
    const grid = document.getElementById('product-grid');
    // Asegurarse de que el grid exista para continuar
    if (!grid) return; 

    // Iniciarla vacía por defecto
    grid.innerHTML = '';

    if (carrito.length === 0) {
        grid.innerHTML = '<h2>No tienes productos en el carrito.</h2>';
    } else {
        // Variable total
        let total = 0;

        // Crear el encabezado
        const table = document.createElement('table');
        table.classList.add('cart-table');

        // Cargar encabezado
        const headerRow = document.createElement('tr');
        const headers = ['Producto', 'Precio', 'Acción'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Agregar los productos a la tabla
        carrito.forEach((product, index) => {
            const row = document.createElement('tr');

            // Columna Producto
            const productNameCell = document.createElement('td');
            const productName = document.createElement('h3');
            productName.textContent = product.name;
            productNameCell.appendChild(productName);

            // Columna Precio
            const productPriceCell = document.createElement('td');
            const productPrice = document.createElement('p');
            productPrice.textContent = '$' + product.price;
            productPriceCell.appendChild(productPrice);

            // Columna Acción (Eliminar)
            const actionCell = document.createElement('td');
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Quitar';
            removeButton.classList.add('btn-remove');
            removeButton.addEventListener('click', () => {
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
        const totalRow = document.createElement('div');
        totalRow.classList.add('cart-total');
        totalRow.innerHTML = `
            <p>Total: $${total.toFixed(2)}</p>
            <button id="buyButton" class="btn-buy">Comprar ahora</button>
        `;
        grid.appendChild(totalRow);

        // Agregar el evento para la compra
        const buyButton = document.getElementById('buyButton');
        if (buyButton) {
            buyButton.addEventListener('click', () => {
                openPaymentForm();
            });
        }
    }
};

// -------------------- Eliminar producto --------------------
let productToRemove = null;

const openModal = (product, index) => {
    productToRemove = { product, index };
    document.getElementById('modal-product-name-remove').textContent = product.name;
    document.getElementById('modal-price-remove').textContent = '$' + product.price;
    toggleModal('confirmationModalRemove', true);
};

document.getElementById('confirmRemove')?.addEventListener('click', () => {
    if (productToRemove) {
        carrito.splice(productToRemove.index, 1);
        updateProductCount();
        displayCart();
        localStorage.setItem('cart', JSON.stringify(carrito));
    }
    closeModalRemove();
    Toastify({
        text: "¡Se eliminó correctamente el producto!",
        className: "info",
        style: {
            background: "linear-gradient(to right,rgb(176, 0, 0),rgb(201, 61, 61))",
            fontWeight: "bold",
        },
        offset: {
            x: 50,
            y: 10,
        },
    }).showToast();
});

const closeModalRemove = () => toggleModal('confirmationModalRemove', false);

// -------------------- Agregar producto --------------------
const addToCart = (productName, price) => {
    const product = new Producto(productName, price);
    carrito.push(product);
    updateProductCount();
    displayCart();
    localStorage.setItem('cart', JSON.stringify(carrito));
};

// -------------------- Confirmación al agregar --------------------
const confirmAddToCart = (cardElement) => {
    const productName = cardElement.querySelector('h2').textContent + " " + cardElement.querySelector('h3').textContent;
    const price = cardElement.querySelector('.precio').textContent;

    document.getElementById('modal-product-name').textContent = productName;
    document.getElementById('modal-price').textContent = price;

    toggleModal('confirmationModalAdd', true);

    const confirmAdd = document.getElementById('confirmAdd');
    if (confirmAdd) {
        confirmAdd.onclick = () => {
            addToCart(productName, price);
            closeModalAdd();
            Toastify({
                text: "¡Se añadió correctamente el producto!",
                className: "info",
                style: {
                    background: "linear-gradient(to right,rgb(176, 0, 0),rgb(201, 61, 61))",
                    fontWeight: "bold",
                },
                offset: {
                    x: 50,
                    y: 10,
                },
            }).showToast();
        };
    }
};

const closeModalAdd = () => toggleModal('confirmationModalAdd', false);

// -------------------- Funciones Visuales Adicionales --------------------
// Toggle para mostrar u ocultar modales
const toggleModal = (modalId, show) => {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = show ? 'block' : 'none';
    }
};

// Función para mostrar secciones específicas
const showSections = (sectionsToShow) => {
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    sectionsToShow.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'block';
    });
};

// Mostrar solo las tiendas al iniciar
window.onload = () => {
    showSections(['tienda', 'tienda-2', 'tienda-3', 'tienda-4']);
};

// Mostrar solo la sección especificada
const showSection = (section) => showSections([section]);

// Animación del contenido de la tarjeta (Mercado Nocturno)
const revealContent = (cardElement) => {
    const inner = cardElement.querySelector('.card-inner');
    if (inner && !inner.classList.contains('revealed')) {
        inner.classList.add('revealed');
    }
};
