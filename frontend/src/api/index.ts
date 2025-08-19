
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

// Add request interceptor to include user ID header
api.interceptors.request.use(
    (config) => {
        // Get user ID from localStorage
        const userId = localStorage.getItem("userId");
        if (userId) {
            config.headers['x-user-id'] = userId;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.headers?.['content-type']?.includes('text/html')) {
            throw new Error("Received HTML instead of JSON. Check your API endpoint.");
        }
        return Promise.reject(error);
    }
);

export default api;





// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:5000/api",
//     headers: {
//         "Content-Type": "application/json",
//     },
// });

// // Example interceptor for attaching token
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default api;
