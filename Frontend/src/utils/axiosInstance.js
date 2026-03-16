import axios from 'axios';

// If running locally → use local backend
// If deployed → use Vercel rewrite
const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "/api";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Session expired. Clearing data...");
      
      localStorage.removeItem("userInfo");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;

// import axios from 'axios';

// //backed url = VITE_API_URL
// const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const api = axios.create({
//   baseURL: BACKEND_URL, 
//   withCredentials: true,
// });

// // Response Interceptor: This runs every time the backend sends a response
// api.interceptors.response.use(
//   (response) => {
//     // If the request is successful (200 OK), just return the data
//     return response;
//   },  
//   (error) => {
//     // If the server returns 401 (Unauthorized), it means the cookie is expired or missing
//     if (error.response && error.response.status === 401) {
//       console.log("Session expired. Clearing data...");
      
//       localStorage.removeItem('userInfo');
      
//       // This ensures the Redux state is also cleared and the user is kicked out
//       window.location.href = '/login'; 
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default api;