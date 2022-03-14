class HttpClient {
    baseAddress = "";

    constructor(baseAddress = "") {
        this.baseAddress = baseAddress;
    }

    // Función bque permitira realizar operaciones HTTP GET de forma asíncrona
    async getAsync(requestUri) {
        return await fetch(`${this.baseAddress}${requestUri}`);
    }

    // Función para hacer POST y PUT enviando contenido en formato Json
    async postAndPutJsonAsync(requestUri, method, value) {
        return await fetch(`${this.baseAddress}${requestUri}`, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(value)
        });
    }

    // Función para ejecutar POST enviando el contenido de la aplicación en formato JSON
    async postAsJsonAsync(requestUri, value) {
        return await this.postAndPutJsonAsync(requestUri, "post", value);
    }

    // Función para ejecutar POST enviando el contenido de la aplicación en formato JSON
    async putAsJsonAsync(requestUri, value) {
        return await this.postAndPutJsonAsync(requestUri, "put", value);
    }

    // Función para realizar operaciones DELETE
    async deleteAsync(requestUri) {
        return await fetch(`${this.baseAddress}${requestUri}`, {
            method: 'delete'
        });
    }
}