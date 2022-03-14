document.getElementById("addProduct").addEventListener("click", addProduct);
document.getElementById("showProducts").addEventListener("click", showProducts);
document.getElementById("findById").addEventListener("click", findById);
document.getElementById("updateProduct").addEventListener("click", updateProduct);
document.getElementById("deleteProduct").addEventListener("click", deleteProduct);

const httpClient = new HttpClient("https://localhost:44318/");
const requestUri = "api/products";

async function getProducts() {
    let productsLength = 0;
    try {
        const response = await httpClient.getAsync(requestUri);
        if (response.ok) {
            products = await response.json();
            productsLength = products.length;
            setProducts(products);
        }
        else {
            await handleResponse(response);
            setProducts(null);
        }
    }
    catch (error) {
        setMessage(`No se pudo obtener la información. (${error.name}, ${error.message})`);
        setProducts(null);
    }
    return productsLength;
}

async function showProducts() {
    setMessage("Procesando...");
    const productsLength = await getProducts();
    if (productsLength > 0) {
        setMessage(`${productsLength} registros leidos.`);
    }
}

async function findById() {
    const id = document.getElementById('id').value;
    try {
        setMessage("Procesando...");
        const response = await httpClient.getAsync(`${requestUri}/${id}`);
        if (response.ok) {
            const product = await response.json();
            setProduct(product); // Mostrar los datos del producto
            setMessage(`Producto ${id} encontrado`);
        }
        else {
            if (response.status == 404) {
                setMessage(`El producto ${id} no fue encontrado.`);
            }
            else {
                await handleResponse(response);
            }
            setProduct(null);
        }
    }
    catch (error) {
        setMessage(`No se pudo obtener la información. (${error.name},${error.message})`);
        setProduct(null);
    }
}

async function addProduct() {
    try {
        setMessage("Procesando...");
        // Construir el objeto con los datos del producto
        let product = {
            name: document.getElementById('name').value,
            unitPrice: parseFloat(document.getElementById('unitPrice').value)
        };
        const response =
            await httpClient.postAsJsonAsync(requestUri, product);
        if (response.ok) {
            product = await response.json();
            setMessage(`Producto ${product.id} agregado.`)
            setProduct(product);
            await getProducts();
        }
        else {
            await handleResponse(response);
        }
    }
    catch (error) {
        setMessage(`No se pudo agregar el producto. (${error.name}, ${error.message})`);
    }
}

async function updateProduct() {
    const id = parseInt(document.getElementById('id').value);
    try {
        setMessage("Procesando...");
        // Construir el objeto con los datos del producto
        let product = {
            id: id,
            name: document.getElementById('name').value,
            unitPrice: parseFloat(document.getElementById('unitPrice').value)
        };
        const response =
            await httpClient.putAsJsonAsync(`${requestUri}/${id}`, product);
        if (response.ok) {
            setMessage(`Producto ${product.id} modificado.`)
            await getProducts();
        }
        else {
            if (response.status == 404) {
                setMessage(`El producto ${id} no fue encontrado.`);
            }
            else {
                await handleResponse(response);
            }
        }
    }
    catch (error) {
        setMessage(`No se pudo modificar el producto. (${error.name}, ${error.message})`);
    }
}

async function deleteProduct() {
    id = document.getElementById('id').value;
    try {
        setMessage("Procesando...");
        const response =
            await httpClient.deleteAsync(`${requestUri}/${id}`);
        if (response.ok) {
            setMessage(`Producto ${id} eliminado.`)
            await getProducts();
        }
        else {
            if (response.status == 404) {
                setMessage(`El producto ${id} no fue encontrado.`);
            }
            else {
                await handleResponse(response);
            }
        }
    }
    catch (error) {
        setMessage(`No se pudo eliminar el producto. (${error.name}, ${error.message})`);
    }
}

function setProduct(product) {
    if (product) {
        item = document.getElementById('id').value = product.id;
        item = document.getElementById('name').value = product.name;
        item = document.getElementById('unitPrice').value = product.unitPrice;
    }
    else {
        document.getElementById('name').value = "";
        document.getElementById('unitPrice').value = "";
    }
}

function setProducts(products) {
    // Obtener el elemento <table> donde serán mostrados los productos
    table = document.getElementById('products');
    // Obtener el elemento <tbody>
    tBody = table.getElementsByTagName("tbody")[0];
    // Obtener el elemento <thead>
    tHead = table.getElementsByTagName("thead")[0];
    // Borrar la información existente actualmente.
    tBody.innerHTML = "";
    tHead.innerHTML = "";
    if (products) { //¿Hay productos?
        // Agregar un renglón en <thead>
        newRow = tHead.insertRow();
        // Iterar por los nombres de las propiedades de un producto.
        // key toma el nombre de la propiedad.
        // products[0][key] tomaría el valor de la propiedad.
        // for/in toma el índice y no el elemento mismo.
        for (var key in products[0]) {
            // Crear un elemento <th>
            newCell = document.createElement("th");
            // Asignar el nombre de la propiedad
            newCell.innerHTML = key;
            // Agregar <th> a <tr>
            newRow.appendChild(newCell);
        }
        products.forEach(p => { // Por cada Producto...
            // Agregar un elemento <tr>
            newRow = tBody.insertRow();
            // Iterar por cada nombre de propiedad y valor del objeto p.
            // key es el nombre de la propiedad.
            // value es el valor.
            // for/of toma el elemento mismo, no el índice.
            for (var [key, value] of Object.entries(p)) {
                // Agregar un <td>
                newCell = newRow.insertCell();
                // Asignar el valor a mostrar
                newCell.innerHTML = value;
                // Agrega <td> a <tr>
                newRow.appendChild(newCell);
            }
        });
    }
}

function setMessage(message) {
    item = document.getElementById('message');
    item.innerHTML = message;
}

async function handleResponse(response) {
    switch (response.status) {
        case 500:
            let detail = await response.text();
            setMessage(`HTTP 500 Internal Server Error: ${detail}`);
            break;
        default:
            let problemDetails = await response.json();
            setMessage(`${problemDetails.status}, ${problemDetails.title}, ${problemDetails.detail}`);
            break;
    }
}