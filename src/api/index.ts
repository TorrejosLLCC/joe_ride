
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

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
