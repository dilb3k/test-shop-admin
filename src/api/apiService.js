import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL

// Create axios instance with optimized configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Accept-Language": typeof window !== "undefined" ? localStorage.getItem("language") || "uz" : "uz",
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers["Accept-Language"] = localStorage.getItem("language") || "uz"
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

// AUTH API
export const authAPI = {
  register: (username, email, password) => axiosInstance.post("/auth/register", { username, email, password }),

  login: (username, password) => axiosInstance.post("/auth/login", { username, password }),
}

// PRODUCTS API
export const productsAPI = {
  getAll: (page = 0, size = 10, sortBy = "id", sortDir = "asc") =>
    axiosInstance.get("/products", { params: { page, size, sortBy, sortDir } }),

  getById: (id) => axiosInstance.get(`/products/${id}`),

  search: (name = "", category = "", page = 0, size = 10) =>
    axiosInstance.get("/products/search", { params: { name, category, page, size } }),

  create: (productData) => axiosInstance.post("/products", productData),

  update: (id, productData) => axiosInstance.put(`/products/${id}`, productData),

  delete: (id) => axiosInstance.delete(`/products/${id}`),
}

// ORDERS API
export const ordersAPI = {
  getAll: (page = 0, size = 10, sortBy = "orderDate", sortDir = "desc") =>
    axiosInstance.get("/orders", { params: { page, size, sortBy, sortDir } }),

  getById: (id) => axiosInstance.get(`/orders/${id}`),

  getByCustomer: (email) => axiosInstance.get(`/orders/customer/${email}`),

  create: (orderData) => axiosInstance.post("/orders", orderData),

  updateStatus: (id, status) => axiosInstance.put(`/orders/${id}/status`, { status }),

  cancel: (id) => axiosInstance.delete(`/orders/${id}`),
}
