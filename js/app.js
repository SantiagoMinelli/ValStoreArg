function revealContent(cardElement) {
    const cardInner = cardElement.querySelector('.card-inner');
    
    // Asegurarse de que solo se haga una vez
    if (!cardInner.classList.contains('revealed')) {
        cardInner.classList.add('revealed'); // Añadir la clase para hacer la animación
    }
}

// Array para almacenar los productos
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Función para mostrar el modal con la información del producto
function confirmAddToCart(cardElement) {
    // Obtener los detalles del producto
    var productName = cardElement.querySelector('h2').textContent + " " + cardElement.querySelector('h3').textContent;
    var price = cardElement.querySelector('.precio').textContent;

    // Mostrar la información en el modal
    document.getElementById('modal-product-name').textContent = productName;
    document.getElementById('modal-price').textContent = price;

    // Mostrar el modal
    document.getElementById('confirmationModal').style.display = "block";

    // Asignar el producto al botón de confirmación
    document.getElementById('confirmAdd').onclick = function() {
        addToCart(productName, price);
        closeModal(); // Cerrar el modal después de agregar al carrito
    };
}

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

    // Ver el contenido del carrito en la consola
    console.log(cart);
}

// Función para cerrar el modal
function closeModal() {
    document.getElementById('confirmationModal').style.display = "none";
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