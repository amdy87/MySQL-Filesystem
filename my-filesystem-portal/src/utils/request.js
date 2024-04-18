import { INVALID_TOKEN_ERROR, HTTP_ERROR } from '@utils/error';

async function useRequest(url, options = {}, needAuth = false) {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    if (needAuth) {
      const token = localStorage.getItem('authToken');

      // If token not found throw error
      if (!token) {
        alert('Authentication failed: No token found.');
        throw new Error(INVALID_TOKEN_ERROR);
      }
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    // Consolodating all the api call info
    const requestOptions = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // api call
    const response = await fetch(url, requestOptions);

    // Throws an unkown error if response comes back negative
    if (!response.ok) {
      const responseBody = await response.json();

      const errorMessage =
        responseBody.message ||
        'An unknown error occurred during the API request.';

      alert(`HTTP Error: ${response.status} ${errorMessage}`);
      throw new Error(HTTP_ERROR);
    }

    return await response.json();
  } catch (error) {
    alert(`Fetch Error: ${error.response.statusText}`);
    throw error;
  }
}

export { useRequest as request };
