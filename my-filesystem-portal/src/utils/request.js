import { HOSTNAME } from "@utils/const"
async function request(url, options = {}) {
    try {
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        const requestOptions = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        const response = await fetch('http://' + HOSTNAME + url, requestOptions);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error.message);
        throw error;
    }
}

export { request }