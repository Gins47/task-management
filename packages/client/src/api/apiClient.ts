// src/api/apiClient.ts
import axios, { AxiosError, AxiosResponse } from "axios";

console.log(`import.meta.env.VITE_API_URL = ${import.meta.env.VITE_API_URL}`);

const apiUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : "http://localhost:3001";

// Create an Axios instance with default settings
const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add authorization tokens or other headers here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can handle responses here (e.g., logging)
    return response.data; // Return only the data
  },
  (error: AxiosError) => {
    // Handle errors globally
    const { response } = error;

    if (response) {
      // The request was made and the server responded with a status code
      console.error("API error:", response.data);
      console.error(`Error: ${response.data || response.statusText}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network error:", error.request);
      console.error("Network error. Please try again later.");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
      console.error("An unexpected error occurred.");
    }

    return Promise.reject(error);
  }
);

// Define API methods
const get = <T>(url: string, params?: object): Promise<T> =>
  apiClient.get(url, { params });
const post = <T>(url: string, data: object): Promise<T> =>
  apiClient.post(url, data);
const put = <T>(url: string, data: object): Promise<T> =>
  apiClient.put(url, data);
const del = <T>(url: string): Promise<T> => apiClient.delete(url);

// Export the API methods for use in your components
const ApiClient = {
  get,
  post,
  put,
  del,
};

export default ApiClient;
