

class ApiWrapper {
    API_URL = "http://localhost:5050/api/";

    /**
     * Fetches data from API via GET method.
     * @param {string} url - Path to the API endpoint.
     * @returns {Promise<T>} - Promise with the response data.
     * @template T
     */
    public async get<T>(url: string): Promise<T> {
        return fetch(this.API_URL + url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "*"
            }
        }).then(res => res.json());
    }

    /**
     * Sends a POST request to the API endpoint.
     * @param {string} url - Path to the API endpoint.
     * @param {any} data - Data to be sent in the request body.
     * @returns {Promise<T>} - Promise with the response data.
     * @template T
     */
    public async post<T>(url: string, data: any): Promise<T> {
        return fetch(this.API_URL + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(data)
        }).then(res => res.json());
    }
}

export default new ApiWrapper();