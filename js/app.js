// Array para almacenar los productos
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Función para mostrar el carrito al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    displayCart();  // Muestra el carrito cuando se carga la página
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

// Función para mostrar los productos en la grilla
function displayCart() {
    var grid = document.getElementById('product-grid');
    grid.innerHTML = '';  // Limpiar la grilla antes de agregar los nuevos productos

    if (cart.length === 0) {
        grid.innerHTML = '<p>No tienes productos en el carrito.</p>';
    } else {
        cart.forEach(function(product, index) {
            var productCard = document.createElement('div');
            productCard.classList.add('product-card');

            // Crear el título y el precio del producto
            var productName = document.createElement('h3');
            productName.textContent = product.name;

            var productPrice = document.createElement('p');
            productPrice.textContent = '$' + product.price;

            // Crear el botón de eliminar
            var removeButton = document.createElement('button');
            removeButton.textContent = 'Eliminar';
            removeButton.classList.add('btn-remove');
            removeButton.addEventListener('click', function() {
                openModal(product, index);  // Abrir el modal de confirmación
            });

            // Agregar los elementos al producto
            productCard.appendChild(productName);
            productCard.appendChild(productPrice);
            productCard.appendChild(removeButton);

            // Agregar la tarjeta a la grilla
            grid.appendChild(productCard);
        });
    }
}

// Función para abrir el modal de eliminación
let productToRemove = null;  // Variable global para almacenar el producto a eliminar
function openModal(product, index) {
    productToRemove = { product, index };  // Guardamos el producto y su índice

    // Mostrar los detalles en el modal
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-price').textContent = '$' + product.price;

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

// Función para mostrar el modal con la información del producto
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
        const sectionsToShow = ['tienda', 'tienda-2', 'tienda-3', 'tienda-4', 'carrito'];
        sectionsToShow.forEach(sectionId => {
            const activeSection = document.getElementById(sectionId);
            if (activeSection) {
                activeSection.style.display = 'block';
            }
        });
    } else if (section === 'carrito') {
        // Asegurarse de que la sección del carrito se muestre correctamente
        const activeSection = document.getElementById('carrito');
        if (activeSection) {
            activeSection.style.display = 'block';
        }
    } else {
        // Mostrar solo la sección seleccionada
        const activeSection = document.getElementById(section);
        if (activeSection) {
            activeSection.style.display = 'block';
        }
    }
}

// Mostrar varias secciones al cargar la página
window.onload = function() {
    const sectionsToShow = ['tienda', 'tienda-2', 'tienda-3', 'tienda-4', 'carrito'];
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
