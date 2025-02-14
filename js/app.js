// -------------------- Inicialización --------------------

// Array Productos en el carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Mostrar el carrito al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    displayCart();
    // Actualizar la cantidad en el enlace
    const cantidadElement = document.getElementById('cantidad-productos');
    if (cantidadElement) {
        cantidadElement.textContent = cart.length;
    }
});

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
            if (digit > 9) {
                digit -= 9;  // Si el doble es mayor que 9, restamos 9
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble; // Alternar entre duplicar y no duplicar
    }

    return sum % 10 === 0;  // Si la suma es divisible por 10, la tarjeta es válida
}


// -------------------- Funciones de Pago --------------------

// Mostrar el formulario de pago al hacer clic en "Comprar ahora"
const buyButton = document.getElementById('buyButton');
if (buyButton) {
    buyButton.addEventListener('click', function() {
        openPaymentForm()
    });
}

// Abrir el Formulario de Pago
function openPaymentForm() {
    const purchaseModal = document.getElementById('paymentForm');
    if (purchaseModal) {
        purchaseModal.style.display = "block";  // Mostrar el modal de compra exitosa
    }
}

// Cerrar el formulario de pago sin realizar la compra
const closePaymentForm = document.getElementById('closePaymentForm');
if (closePaymentForm) {
    closePaymentForm.addEventListener('click', function() {
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.style.display = "none";  // Ocultar el formulario de pago
        }
    });
};

// Cerrar el formulario de pago al hacer clic en el botón closePaymentFormUp
const closePaymentFormUp = document.getElementById('closePaymentFormUp');
if (closePaymentFormUp) {
    closePaymentFormUp.addEventListener('click', function() {
        const paymentFormModal = document.getElementById('paymentForm');
        if (paymentFormModal) {
            paymentFormModal.style.display = "none";  // Cerrar el formulario de pago
        }
    });
}

// Formulario de pago (hacer la compra)
const paymentForm = document.getElementById('payment-form');
if (paymentForm) {
    paymentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        let cardNumber = document.getElementById('card-number').value.trim();
        let cardName = document.getElementById('card-name').value.trim();
        let expiryDate = document.getElementById('expiry-date').value.trim();
        let cvv = document.getElementById('cvv').value.trim();
        let dni = document.getElementById('dni').value.trim();

        // Validar tarjeta con el algoritmo de Luhn
        if (!validateCardNumber(cardNumber)) {
            alert("Número de tarjeta inválido.");
            return; // No continuar si el número de tarjeta es inválido
        }

        // Verificar si todos los campos están completos
        if (cardName === "" || expiryDate === "" || cvv === "" || dni === "") {
            alert("Por favor, complete todos los campos.");
            return; // No continuar si falta algún campo
        }

        // Si todos los campos están completos y la tarjeta es válida, proceder con la compra

        // Ocultar el formulario de pago
        const paymentFormModal = document.getElementById('paymentForm');
        if (paymentFormModal) {
            paymentFormModal.style.display = "none";  // Ocultar el formulario de pago
        }

        // Vaciar el carrito
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();  // Actualizar la vista del carrito

        // Mostrar el modal de compra exitosa
        openPurchaseModal();  // Ahora se abre el modal de compra exitosa
    });
}

// -------------------- Funciones para verificar si todos los campos están completos --------------------

// Verificar todos los campos
const formInputs = document.querySelectorAll('#payment-form input');
const submitButton = document.getElementById('buy');

function checkFormCompletion() {
    let allFilled = true;

    formInputs.forEach(input => {
        if (input.value.trim() === '') {
            allFilled = false;
        }
    });

    // Además de los campos completos, verificamos si la tarjeta es válida
    let cardNumber = document.getElementById('card-number').value.trim();
    let isCardValid = validateCardNumber(cardNumber);

    // Deshabilitar el botón si algún campo está vacío o la tarjeta es inválida
    submitButton.disabled = !allFilled || !isCardValid; 
}

// Agregar evento a cada campo para verificar cuando se escriba en ellos
formInputs.forEach(input => {
    input.addEventListener('input', checkFormCompletion); // Verificar cada campo cuando se escribe
});

// -------------------- Funciones del Carrito --------------------

// Agregar un producto
function addToCart(productName, price) {
    // Crear un objeto de producto
    var product = {
        name: productName,
        price: price
    };

    // Agregar el producto al carrito (array)
    cart.push(product);

    // Actualizar la cantidad en el enlace
    const cantidadElement = document.getElementById('cantidad-productos');
    if (cantidadElement) {
        cantidadElement.textContent = cart.length;
    }

    // Actualizar la grilla de productos
    displayCart();

    // Guardar el nuevo carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Ver el contenido del carrito en la consola
    console.log(cart);
}

// Mostrar los productos en la tabla
function displayCart() {
    var grid = document.getElementById('product-grid');
    if (!grid) return; // Asegurarse de que el grid exista

    // Iniciarla vacía por defecto
    grid.innerHTML = '';

    if (cart.length === 0) {
        grid.innerHTML = '<h2>No tienes productos en el carrito.</h2>';
    } else {
        // Variable total de la compra
        var total = 0;

        // Crear el encabezado de la tabla
        var table = document.createElement('table');
        table.classList.add('cart-table');

        // Encabezado
        var headerRow = document.createElement('tr');
        var headers = ['Producto', 'Precio', 'Acción'];
        headers.forEach(function(headerText) {
            var th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Agregar los productos a la tabla
        cart.forEach(function(product, index) {
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

            // Agregar la fila a la tabla
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

    // Mostrar los detalles en el modal
    document.getElementById('modal-product-name-remove').textContent = product.name;
    document.getElementById('modal-price-remove').textContent = '$' + product.price;

    // Mostrar el modal
    const confirmationModalRemove = document.getElementById('confirmationModalRemove');
    if (confirmationModalRemove) {
        confirmationModalRemove.style.display = "block";
    }
}

// Confirmar la eliminación
const confirmRemove = document.getElementById('confirmRemove');
if (confirmRemove) {
    confirmRemove.addEventListener('click', function() {
        if (productToRemove) {
            // Eliminar el producto del array
            cart.splice(productToRemove.index, 1);

            // Actualizar la cantidad en el enlace
            const cantidadElement = document.getElementById('cantidad-productos');
            if (cantidadElement) {
                cantidadElement.textContent = cart.length;
            }

            // Actualizar la grilla
            displayCart();

            // Guardar el nuevo carrito en localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        closeModalRemove();
    });
}

// Cerrar el modal de eliminación
function closeModalRemove() {
    const confirmationModalRemove = document.getElementById('confirmationModalRemove');
    if (confirmationModalRemove) {
        confirmationModalRemove.style.display = "none";
    }
}

// Mostrar el modal para agregar el producto
function confirmAddToCart(cardElement) {
    // Obtener los detalles del producto
    var productName = cardElement.querySelector('h2').textContent + " " + cardElement.querySelector('h3').textContent;
    var price = cardElement.querySelector('.precio').textContent;

    // Mostrar la información en el modal
    document.getElementById('modal-product-name').textContent = productName;
    document.getElementById('modal-price').textContent = price;

    // Mostrar el modal
    const confirmationModalAdd = document.getElementById('confirmationModalAdd');
    if (confirmationModalAdd) {
        confirmationModalAdd.style.display = "block";
    }

    // Agregar el producto al confirmar
    const confirmAdd = document.getElementById('confirmAdd');
    if (confirmAdd) {
        confirmAdd.onclick = function() {
            addToCart(productName, price);
            closeModalAdd();
        };
    }
}

// Cerrar el modal de agregar producto
function closeModalAdd() {
    const confirmationModalAdd = document.getElementById('confirmationModalAdd');
    if (confirmationModalAdd) {
        confirmationModalAdd.style.display = "none";
    }
}

// -------------------- Funciones de Finalización de Compra --------------------

// Abrir el modal de compra exitosa
function openPurchaseModal() {
    const purchaseModal = document.getElementById('purchaseModal');
    if (purchaseModal) {
        purchaseModal.style.display = "block";  // Mostrar el modal de compra exitosa
    }
}

// Cerrar el modal de compra exitosa
const closePurchaseModal = document.getElementById('closePurchaseModal');
if (closePurchaseModal) {
    closePurchaseModal.addEventListener('click', function() {
        const purchaseModal = document.getElementById('purchaseModal');
        if (purchaseModal) {
            purchaseModal.style.display = "none";  // Cerrar el modal de compra exitosa
        }
        cart = [];  // Vaciar el carrito
        localStorage.setItem('cart', JSON.stringify(cart));  // Guardar el carrito vacío
        const cantidadElement = document.getElementById('cantidad-productos');
        if (cantidadElement) {
            cantidadElement.textContent = cart.length;  // Actualizar la cantidad de productos
        }
        displayCart();  // Actualizar la vista
    });
}

// -------------------- Funciones Adicionales --------------------

// Mostrar solo las tiendas al iniciar
function showSection(section) {
    // Ocultar todas las demás secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.style.display = 'none');

    if (section === 'tienda') {
        const sectionsToShow = ['tienda', 'tienda-2', 'tienda-3', 'tienda-4'];
        sectionsToShow.forEach(sectionId => {
            const activeSection = document.getElementById(sectionId);
            if (activeSection) {
                activeSection.style.display = 'block';
            }
        });
    } else {
        const activeSection = document.getElementById(section);
        if (activeSection) {
            activeSection.style.display = 'block';
        }
    }
}

// Mostrar solo la tienda al iniciar
window.onload = function() {
    const sectionsToShow = ['tienda', 'tienda-2', 'tienda-3', 'tienda-4'];
    sectionsToShow.forEach(section => {
        const activeSection = document.getElementById(section);
        if (activeSection) {
            activeSection.style.display = 'block';
        }
    });
};

// Animación del contenido de la tarjeta (Mercado Nocturno)
function revealContent(cardElement) {
    const cardInner = cardElement.querySelector('.card-inner');

    // Asegurarse de que solo se haga una vez
    if (cardInner && !cardInner.classList.contains('revealed')) {
        cardInner.classList.add('revealed');
    }
}
