// Array para almacenar los productos
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Función para mostrar el carrito al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    displayCart();  
});

// Función para agregar el producto al carrito
function addToCart(productName, price) {
    // Crear un objeto de producto
    var product = {
        name: productName,
        price: price
    };

    // Agregar el producto al carrito (array)
    cart.push(product);

    // Actualizar la cantidad en el enlace
    document.getElementById('cantidad-productos').textContent = cart.length;

    // Actualizar la grilla de productos
    displayCart();

    // Guardar el carrito en localStorage para persistencia
    localStorage.setItem('cart', JSON.stringify(cart));

    // Ver el contenido del carrito en la consola
    console.log(cart);
}

// Función para mostrar los productos en la tabla
function displayCart() {
    var grid = document.getElementById('product-grid');
    grid.innerHTML = '';  // Limpiar la tabla antes de agregar los nuevos productos

    if (cart.length === 0) {
        grid.innerHTML = '<h2>No tienes productos en el carrito.</h2>';
    } else {
        var total = 0; // Variable para acumular el total de la compra

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

            // Columna para el nombre del producto
            var productNameCell = document.createElement('td');
            var productName = document.createElement('h3');
            productName.textContent = product.name;
            productNameCell.appendChild(productName);

            // Columna para el precio del producto
            var productPriceCell = document.createElement('td');
            var productPrice = document.createElement('p');
            productPrice.textContent = '$' + product.price;
            productPriceCell.appendChild(productPrice);

            // Columna para la acción (botón eliminar)
            var actionCell = document.createElement('td');
            var removeButton = document.createElement('button');
            removeButton.textContent = 'Quitar';
            removeButton.classList.add('btn-remove');
            removeButton.addEventListener('click', function() {
                openModal(product, index);  // Abrir el modal de confirmación
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

        // Agregar el total y el botón de compra
        var totalRow = document.createElement('div');
        totalRow.classList.add('cart-total');
        totalRow.innerHTML = `
            <p>Total: $${total.toFixed(2)}</p>
            <button id="buyButton" class="btn-buy">Comprar</button>
        `;
        grid.appendChild(totalRow);

        // Agregar el evento para la compra
        document.getElementById('buyButton').addEventListener('click', function() {
            openPurchaseModal(); // Mostrar modal de compra exitosa
        });
    }
}

// Función para abrir el modal de eliminación
let productToRemove = null;  // Variable global para almacenar el producto a eliminar
function openModal(product, index) {
    productToRemove = { product, index };  // Guardamos el producto y su índice

    // Mostrar los detalles en el modal
    document.getElementById('modal-product-name-remove').textContent = product.name;
    document.getElementById('modal-price-remove').textContent = '$' + product.price;

    // Mostrar el modal
    document.getElementById('confirmationModalRemove').style.display = "block";
}

// Función para confirmar la eliminación
document.getElementById('confirmRemove').addEventListener('click', function() {
    if (productToRemove) {
        // Eliminar el producto del array
        cart.splice(productToRemove.index, 1);

        // Actualizar la cantidad en el enlace
        document.getElementById('cantidad-productos').textContent = cart.length;

        // Actualizar la grilla
        displayCart();

        // Guardar el carrito en localStorage para persistencia
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Cerrar el modal
    closeModalRemove();
});

// Función para cerrar el modal de eliminación
function closeModalRemove() {
    document.getElementById('confirmationModalRemove').style.display = "none";
}

// Función para mostrar el modal con la confirmación del producto
function confirmAddToCart(cardElement) {
    // Obtener los detalles del producto
    var productName = cardElement.querySelector('h2').textContent + " " + cardElement.querySelector('h3').textContent;
    var price = cardElement.querySelector('.precio').textContent;

    // Mostrar la información en el modal
    document.getElementById('modal-product-name').textContent = productName;
    document.getElementById('modal-price').textContent = price;

    // Mostrar el modal
    document.getElementById('confirmationModalAdd').style.display = "block";

    // Asignar el producto al botón de confirmación
    document.getElementById('confirmAdd').onclick = function() {
        addToCart(productName, price);
        closeModalAdd(); // Cerrar el modal después de agregar al carrito
    };
}

// Función para cerrar el modal de agregar producto
function closeModalAdd() {
    document.getElementById('confirmationModalAdd').style.display = "none";
}

// Función para mostrar las secciones correspondientes y ocultar las demás
function showSection(section) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.style.display = 'none');

    // Mostrar secciones específicas para 'tienda'
    if (section === 'tienda') {
        const sectionsToShow = ['tienda', 'tienda-2', 'tienda-3', 'tienda-4'];
        sectionsToShow.forEach(sectionId => {
            const activeSection = document.getElementById(sectionId);
            if (activeSection) {
                activeSection.style.display = 'block';
            }
        });
    } else {
        // Mostrar solo la sección seleccionada
        const activeSection = document.getElementById(section);
        if (activeSection) {
            activeSection.style.display = 'block';
        }
    }
}

// Función para abrir el modal de compra exitosa
function openPurchaseModal() {
    document.getElementById('purchaseModal').style.display = "block";  // Mostrar el modal de compra exitosa
}



// Función para cerrar el modal de compra exitosa
document.getElementById('closePurchaseModal').addEventListener('click', function() {
    document.getElementById('purchaseModal').style.display = "none";  // Cerrar el modal
    cart = [];  // Vaciar el carrito
    localStorage.setItem('cart', JSON.stringify(cart));  // Guardar el carrito vacío
    displayCart();  // Actualizar la vista
});

// Función para cerrar el modal de compra
function closeModalBuy() {
    document.getElementById('purchaseModal').style.display = "none";
    cart = [];  // Vaciar el carrito
    localStorage.setItem('cart', JSON.stringify(cart));  // Guardar el carrito vacío
    displayCart();  // Actualizar la vista
}

// Mostrar varias secciones al cargar la página
window.onload = function() {
    const sectionsToShow = ['tienda', 'tienda-2', 'tienda-3', 'tienda-4'];
    sectionsToShow.forEach(section => {
        const activeSection = document.getElementById(section);
        if (activeSection) {
            activeSection.style.display = 'block';
        }
    });
};

// Función para mostrar el contenido de la tarjeta (animación)
function revealContent(cardElement) {
    const cardInner = cardElement.querySelector('.card-inner');

    // Asegurarse de que solo se haga una vez
    if (!cardInner.classList.contains('revealed')) {
        cardInner.classList.add('revealed'); // Añadir la clase para hacer la animación
    }
}
