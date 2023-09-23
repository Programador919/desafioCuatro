const socket = io()
socket.emit("message", "Hola, me estoy comuncando desde un webSocket")

socket.on("productAdded", (product) => {
    // Crear un nuevo elemento HTML para el producto
    const newProductElement = document.createElement("div");
    newProductElement.innerHTML = `
        <h2>${product.title}</h2>
        <p>${product.description}</p>
        <!-- Otros campos del producto -->
    `;

    // Agregar el nuevo producto al contenedor de productos
    const productsContainer = document.getElementById("productsContainer");
    productsContainer.appendChild(newProductElement);
});
