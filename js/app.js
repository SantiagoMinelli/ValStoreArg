// -------------------- Inicialización --------------------
let carrito = JSON.parse(localStorage.getItem('cart')) || [];

// Cargado de la página
document.addEventListener("DOMContentLoaded", () => {
    getSkins();
    displayCart();       
    updateProductCount();
    document.getElementById("year").textContent = new Date().getFullYear(); // Footer
});

// -------------------- Clase Producto --------------------
class Producto {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }
}

// -------------------- Validación de tarjeta --------------------
const validateCardNumber = (cardNumber) => {
    let sum = 0, shouldDouble = false;
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

// -------------------- Checkeo de formulario --------------------
const checkFormCompletion = () => {
    const inputs = [...document.querySelectorAll('#payment-form input')];
    const allFilled = inputs.every(input => input.value.trim() !== '');
    const cardNumber = document.getElementById('card-number').value.replace(/\s+/g, '').trim();
    const isCardValid = validateCardNumber(cardNumber);
    document.getElementById('buy').disabled = !(allFilled && isCardValid);
};

// -------------------- Funciones de Pago --------------------
const openPaymentForm = () => toggleModal('paymentForm', true);

document.getElementById('closePaymentForm')?.addEventListener('click', () => toggleModal('paymentForm', false));
document.getElementById('closePaymentFormUp')?.addEventListener('click', () => toggleModal('paymentForm', false));

document.getElementById('payment-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const cardNumber = document.getElementById('card-number').value.replace(/\s+/g, '').trim();
    const cardName = document.getElementById('card-name').value.trim();
    const expiryDate = document.getElementById('expiry-date').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const dni = document.getElementById('dni').value.trim();

    // Validar número de tarjeta
    if (!validateCardNumber(cardNumber)) {
        Swal.fire({
            title: "¡Número de tarjeta inválido!",
            text: "Por favor, verifique que los datos sean correctos",
            icon: "warning",
            showConfirmButton: true,
            showClass: {
                popup: `animate__animated animate__fadeInUp animate__faster`
            },
            hideClass: {
                popup: `animate__animated animate__fadeOutDown animate__faster`
            }
        });
        return;
    }

    // Validar si todos los datos están completos
    if ([cardName, expiryDate, cvv, dni].some(val => val === '')) {
        Swal.fire({
            title: "¡Algo falta!",
            text: "Por favor, complete todos los campos",
            icon: "warning",
            showConfirmButton: true,
            showClass: {
                popup: `animate__animated animate__fadeInUp animate__faster`
            },
            hideClass: {
                popup: `animate__animated animate__fadeOutDown animate__faster`
            }
        });
        return;
    }

    // Validar DNI
    if (!/^\d{7,8}$/.test(dni)) {
        Swal.fire({
            title: "¡DNI inválido!",
            text: "El DNI debe tener entre 7 y 8 dígitos numéricos.",
            icon: "warning",
            showConfirmButton: true,
            showClass: {
                popup: `animate__animated animate__fadeInUp animate__faster`
            },
            hideClass: {
                popup: `animate__animated animate__fadeOutDown animate__faster`
            }
        });
        return;
    }

    // Validar formato de fecha
    const expiryPattern = /^\d{2}\/\d{2}$/;
    if (!expiryPattern.test(expiryDate)) {
        Swal.fire({
            title: "¡Fecha de vencimiento inválida!",
            text: "Use el formato MM/AA",
            icon: "warning",
            showConfirmButton: true,
            showClass: {
                popup: `animate__animated animate__fadeInUp animate__faster`
            },
            hideClass: {
                popup: `animate__animated animate__fadeOutDown animate__faster`
            }
        });
        return;
    }

    // Validar que el mes sea correcto
    const [month, year] = expiryDate.split('/').map(Number);
    if (month < 1 || month > 12) {
        Swal.fire({
            title: "¡El mes ingresado no es válido!",
            text: "Debe ingresar con el formato entre el 01 y 12",
            icon: "warning",
            showConfirmButton: true,
            showClass: {
                popup: `animate__animated animate__fadeInUp animate__faster`
            },
            hideClass: {
                popup: `animate__animated animate__fadeOutDown animate__faster`
            }
        });
        return;
    }

    // Validar que la fecha de la tarjeta no esté vencida
    const currentDate = new Date();
    const currentYear = Number(currentDate.getFullYear().toString().slice(2)); // últimos dos dígitos
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        Swal.fire({
            title: "¡Lo sentimos!",
            text: "La fecha nos indica que su tarjeta está vencida",
            icon: "warning",
            showConfirmButton: true,
            showClass: {
                popup: `animate__animated animate__fadeInUp animate__faster`
            },
            hideClass: {
                popup: `animate__animated animate__fadeOutDown animate__faster`
            }
        });
        return;
    }

    // Mostrar modal de carga de pago
    Swal.fire({
        title: 'Procesando pago ...',
        html: `
            <div style="width: 120px; height: 120px; margin: 0 auto 20px auto; background: #e0e0e0; border-radius: 10px; overflow: hidden; position: relative;">
                <div id="image-reveal" style="width: 0%; height: 100%; overflow: hidden; position: absolute; top: 0; left: 0;">
                    <img src="./img/icono-pestaña.png" alt="Cargando" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
            </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
            const reveal = Swal.getPopup().querySelector('#image-reveal');
            let width = 0;
            const interval = setInterval(() => {
                width += 2.5;
                reveal.style.width = `${width}%`;
                if (width >= 100) clearInterval(interval);
            }, 100);
        }
    });

    // Esperar 5 segundos antes de mostrar el mensaje final
    setTimeout(() => {
        carrito = [];
        localStorage.setItem('cart', JSON.stringify(carrito));
        toggleModal('paymentForm', false);
        displayCart();
        updateProductCount();

        Swal.fire({
            title: "¡Compra realizada con éxito!",
            text: "Muchas gracias por comprar con ValStore ARG",
            icon: "success",
            showConfirmButton: false,
            timer: 3500,
            showClass: {
                popup: `animate__animated animate__fadeInUp animate__faster`
            },
            hideClass: {
                popup: `animate__animated animate__fadeOutDown animate__faster`
            }
        });
    }, 5000);
});

// -------------------- Autocompletado para MM/AA --------------------
document.getElementById('expiry-date')?.addEventListener('input', (e) => {
    let value = e.target.value;

    // Quitar cualquier carácter que no sea dígito o "/"
    value = value.replace(/[^\d/]/g, '');

    // Agregar "/" automáticamente después del segundo número
    if (value.length === 2 && !value.includes('/')) {
        value = value + '/';
    }

    // Limitar a 5 caracteres (4 nros y la barra)
    if (value.length > 5) {
        value = value.slice(0, 5);
    }

    e.target.value = value;
    checkFormCompletion();
});

// -------------------- Autocompletar Apellido y Nombre en mayúsculas --------------------
document.getElementById('card-name')?.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
    checkFormCompletion();
});

// -------------------- Formatear número de tarjeta [4,4,4,4] --------------------
document.getElementById('card-number')?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');

    // Patrón utilizado en tarjetas como Visa, Mastercard
    const pattern = [4, 4, 4, 4]; 
    let formatted = '';
    let index = 0;

    // Añade el espacio cuando se va completando el patron
    for (let i = 0; i < pattern.length && index < value.length; i++) {
        const segment = value.substr(index, pattern[i]);
        formatted += segment + ' ';
        index += pattern[i];
    }

    formatted = formatted.trim();
    e.target.value = formatted;

    checkFormCompletion();
});

// -------------------- Verificación de inputs --------------------
document.querySelectorAll('#payment-form input').forEach(input =>
    input.addEventListener('input', checkFormCompletion)
);


// -------------------- Cargar datos de skins --------------------
const getSkins = async () => {
    try {
        const res = await fetch("skins.json");
        const datosSkins = await res.json();
        loadDom(datosSkins);
    } catch (error) {
        Swal.fire({
            title: "¡Ups!",
            text: "No pudimos acceder a las skins, intentelo nuevamente en otro momento",
            icon: "error",
            showClass: {
                popup: `animate__animated animate__fadeInUp animate__faster`
            },
            hideClass: {
                popup: `animate__animated animate__fadeOutDown animate__faster`
            }
        });
    }
};

// -------------------- Renderizado de secciones --------------------
const loadDom = (skins) => {
    cargarOfertas(skins.ofertas);
    cargarMercadoNocturno(skins.mercado_nocturno);
    cargarTienda(skins.tienda);
};

// -------------------- Sección Ofertas --------------------
const cargarOfertas = (ofertas = []) => {
    const contenedor = document.querySelector("#oferta .container") || document.createElement("div");
    contenedor.classList.add("container");
    document.getElementById("oferta").innerHTML = "";
    document.getElementById("oferta").appendChild(contenedor);

    for (let i = 0; i < ofertas.length; i += 4) {
        const fila = document.createElement("div");
        fila.classList.add("row");
        ofertas.slice(i, i + 4).forEach(item => {
            const col = document.createElement("div");
            col.classList.add("col-3");
            col.innerHTML = `
                <div class="card-tienda" onclick="confirmAddToCart(this)">
                    <img src="${item.imagen}" alt="${item.skin}" class="card-img">
                    <p class="precio-anterior">${item.precio_anterior}</p>
                    <p class="precio">${item.precio}</p>
                    <h2>${item.skin.toUpperCase()}</h2>
                    <h3>${item.arma.toUpperCase()}</h3>
                </div>
            `;
            fila.appendChild(col);
        });
        contenedor.appendChild(fila);
    }
};

// -------------------- Sección Mercado Nocturno --------------------
const cargarMercadoNocturno = (mercadoNocturno = []) => {
    const mercado = document.querySelector('#tienda');
    let html = `
        <div class="encabezado">
            <h1>MERCADO NOCTURNO</h1>
            <p>Haz click sobre las tarjetas para descubrir las skins sorpresa de este mercado nocturno</p>
        </div>
    `;

    mercadoNocturno.forEach(skin => {
        html += `
            <div class="card" onclick="revealContent(this)">
                <div class="card-inner">
                    <div class="card-front">
                        <img src="./img/tarjeta-medio.jpg" alt="Imagen Inicial" class="card-img">
                    </div>
                    <div class="card-back" onclick="confirmAddToCart(this)">
                        <img src="${skin.imagen}" alt="${skin.skin}" class="card-img">
                        <p class="precio-anterior">${skin.precio_anterior}</p>
                        <p class="precio">${skin.precio}</p>
                        <h2>${skin.arma}</h2>
                        <h3>${skin.skin}</h3>
                    </div>
                </div>
            </div>
        `;
    });

    mercado.innerHTML = html;
};

// -------------------- Sección Tienda --------------------
const cargarTienda = (tiendaData = []) => {
    tiendaData.forEach((coleccion, i) => {
        const tienda = document.querySelector(`#tienda-${i + 2}`);
        let html = `
            <div class="container">
                <div class="row">
                    <div class="col-1"></div>
                    <div class="col-10">
                        <div class="card" onclick="confirmAddToCart(this)">
                            <img src="${coleccion.imagen_principal}" alt="${coleccion.nombre}" class="card-img">
                            <h2>${coleccion.nombre}</h2>
                            <h3>${coleccion.skin}</h3>
                            <p class="precio">7100</p>
                        </div>
                    </div>
                    <div class="col-1"></div>
                </div>
                <div class="row">
        `;

        coleccion.subitems.forEach(skin => {
            html += `
                <div class="col-3">
                    <div class="card-tienda" onclick="confirmAddToCart(this)">
                        <img src="${skin.imagen}" alt="${skin.skin}" class="card-img">
                        <p class="precio">${skin.precio}</p>
                        <h2>${skin.skin}</h2>
                        <h3>${skin.arma}</h3>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
        tienda.innerHTML = html;
    });
};

// -------------------- Carrito --------------------
const updateProductCount = () => {
    const cantidadElement = document.getElementById('cantidad-productos');
    if (cantidadElement) cantidadElement.textContent = carrito.length;
};

const displayCart = () => {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (carrito.length === 0) {
        grid.innerHTML = '<h2>No tienes productos en el carrito.</h2>';
        return;
    }

    let total = 0;
    const table = document.createElement('table');
    table.classList.add('cart-table');

    const headerRow = document.createElement('tr');
    ['Producto', 'Precio', 'Acción'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    carrito.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><h3>${product.name}</h3></td>
            <td><p>$${product.price}</p></td>
            <td><button class="btn-remove">Quitar</button></td>
        `;
        row.querySelector('button').addEventListener('click', () => openModal(product, index));
        table.appendChild(row);
        total += parseFloat(product.price);
    });

    grid.appendChild(table);

    const totalRow = document.createElement('div');
    totalRow.classList.add('cart-total');
    totalRow.innerHTML = `
        <p>Total: $${total.toFixed(2)}</p>
        <button id="buyButton" class="btn-buy">Comprar ahora</button>
    `;
    grid.appendChild(totalRow);

    document.getElementById('buyButton').addEventListener('click', openPaymentForm);
};

// -------------------- Agregar y quitar productos --------------------
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
        offset: { x: 50, y: 10 },
    }).showToast();
});

const closeModalRemove = () => toggleModal('confirmationModalRemove', false);

const addToCart = (productName, price) => {
    const alreadyInCart = carrito.some(product => product.name === productName);

    if (alreadyInCart) {
        Swal.fire({
            title: "¡Ya posee esta skin en el carrito!",
            icon: "info",
            showClass: {
                popup: `animate__animated animate__fadeInUp animate__faster`
            },
            hideClass: {
                popup: `animate__animated animate__fadeOutDown animate__faster`
            }
        });
        return;
    }

    const product = new Producto(productName, price);
    carrito.push(product);
    updateProductCount();
    displayCart();
    localStorage.setItem('cart', JSON.stringify(carrito));

    Toastify({
        text: "¡Se añadió correctamente el producto!",
        className: "info",
        style: {
            background: "linear-gradient(to right,rgb(176, 0, 0),rgb(201, 61, 61))",
            fontWeight: "bold",
        },
        offset: { x: 50, y: 10 },
    }).showToast();
};


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
        };
    }
};

const closeModalAdd = () => toggleModal('confirmationModalAdd', false);

// -------------------- Funciones Visuales --------------------
const toggleModal = (modalId, show) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = show ? 'block' : 'none';
};

const showSections = (sectionsToShow) => {
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    sectionsToShow.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'block';
    });
};

const showSection = (section) => showSections([section]);

const revealContent = (cardElement) => {
    const inner = cardElement.querySelector('.card-inner');
    if (inner && !inner.classList.contains('revealed')) {
        inner.classList.add('revealed');
    }
};

// -------------------- Carga inicial --------------------
window.onload = () => {
    showSections(['tienda', 'tienda-2', 'tienda-3', 'tienda-4']);
};
