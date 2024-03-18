import { HOSTNAME } from "@utils/const"
import { useNavigate } from 'react-router-dom';

async function request(url, options = {}, needAuth = false) {
    const navigate = useNavigate();
    try {
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        if(needAuth){
            token = localStorage.getItem("authToken");
            if(!token){
                navigate("");
            }
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }

        const requestOptions = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        const response = await fetch('http://' + HOSTNAME + "/backend" + url, requestOptions);

        if (!response.ok) {
            alert(await response.text());
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error.message);
        throw error;
    }
}

export { request }
