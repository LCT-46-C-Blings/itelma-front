

class ApiWrapper {
    API_URL = "http://localhost:5050/api/";

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