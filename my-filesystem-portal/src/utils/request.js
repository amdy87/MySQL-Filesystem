import { INVALID_TOKEN_ERROR, HTTP_ERROR } from '@utils/error';

async function useRequest(url, options = {}, needAuth = false) {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    if (needAuth) {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw {
          name: INVALID_TOKEN_ERROR,
        };
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

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw {
        name: HTTP_ERROR,
        response: response,
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error.message);
    throw error;
  }
}

export { useRequest as request };
