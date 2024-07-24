import axios from 'axios';

const createRequest = async (options) => {
    const { method, url, data, headers = {} } = options;
    const apiUrl = 'https://chat-app-n0ye.onrender.com';
    try {
      const response = await fetch(`${apiUrl}${url}`, {
        method: method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error making request:', error);
      throw error;
    }
  };
  
  export default createRequest;
  