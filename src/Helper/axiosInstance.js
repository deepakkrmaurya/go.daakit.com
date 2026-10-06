
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const baseURL = import.meta.env.VITE_BASE_URL;



const clearStorageAndRedirect = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userType");
  localStorage.removeItem("permission");
  localStorage.clear();
};

const handleLogout = () => {
  try {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const role = decoded.usertype || decoded.type || decoded.userType;
    
    if (role === "vendor") {
      clearStorageAndRedirect()  
    } else if (role === "admin") {
      clearStorageAndRedirect()
      // navigate("/login/admin");
    } else if (UserRoles.includes(role)) {
      clearStorageAndRedirect()
      // navigate("/login/user");
    } else {
      clearStorageAndRedirect()
      // navigate("/login");
    }

    toast.success("Logout successful");
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong.");
  }
};

// Create Axios Instance
const AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  withCredentials:true
});

// Request Interceptor
AxiosInstance.interceptors.request.use(
  config => {

    // Get Token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// Response Interceptor
AxiosInstance.interceptors.response.use(
  response => response,
  error => {

    // Token Expired / Unauthorized
    if (error?.response?.status === 401) {
       return
      // Remove Token
      localStorage.removeItem("token");

      // Redirect Login Page
      
      



      

      console.log("Logout User");
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;


