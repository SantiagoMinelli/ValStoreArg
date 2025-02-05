function revealContent(cardElement) {
    const cardInner = cardElement.querySelector('.card-inner');
    
    // Asegurarse de que solo se haga una vez
    if (!cardInner.classList.contains('revealed')) {
        cardInner.classList.add('revealed'); // Añadir la clase para hacer la animación
    }
}