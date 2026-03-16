import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.VITE_API_URL || "http://localhost:3001/api";

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle responses
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("auth_token");
          window.location.href = "/";
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
    }
    return response.data;
  }

  async register(email: string, password: string, name: string) {
    const response = await this.client.post("/auth/register", {
      email,
      password,
      name,
    });
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
    }
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get("/auth/me");
    return response.data;
  }

  // Orders endpoints
  async getOrders(filters?: { status?: string; skip?: number; take?: number }) {
    const response = await this.client.get("/orders", { params: filters });
    return response.data;
  }

  async getOrderById(id: string) {
    const response = await this.client.get(`/orders/${id}`);
    return response.data;
  }

  async createOrder(data: {
    customerId: string;
    items: Array<{ productId: string; quantity: number }>;
    notes?: string;
  }) {
    const response = await this.client.post("/orders", data);
    return response.data;
  }

  async updateOrderStatus(id: string, status: string) {
    const response = await this.client.patch(`/orders/${id}/status`, { status });
    return response.data;
  }

  async cancelOrder(id: string) {
    const response = await this.client.post(`/orders/${id}/cancel`);
    return response.data;
  }

  // Products endpoints
  async getProducts(filters?: { category?: string; skip?: number; take?: number }) {
    const response = await this.client.get("/products", { params: filters });
    return response.data;
  }

  async getProductById(id: string) {
    const response = await this.client.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(data: {
    name: string;
    sku: string;
    category: string;
    price: number;
  }) {
    const response = await this.client.post("/products", data);
    return response.data;
  }

  async updateProduct(id: string, data: Partial<any>) {
    const response = await this.client.put(`/products/${id}`, data);
    return response.data;
  }

  async deleteProduct(id: string) {
    const response = await this.client.delete(`/products/${id}`);
    return response.data;
  }

  // Customers endpoints
  async getCustomers(filters?: { skip?: number; take?: number }) {
    const response = await this.client.get("/customers", { params: filters });
    return response.data;
  }

  async getCustomerById(id: string) {
    const response = await this.client.get(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(data: {
    name: string;
    email?: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }) {
    const response = await this.client.post("/customers", data);
    return response.data;
  }

  async updateCustomer(id: string, data: Partial<any>) {
    const response = await this.client.put(`/customers/${id}`, data);
    return response.data;
  }

  async deleteCustomer(id: string) {
    const response = await this.client.delete(`/customers/${id}`);
    return response.data;
  }

  // Inventory endpoints
  async getInventory(productId?: string) {
    const response = await this.client.get("/inventory", {
      params: { productId },
    });
    return response.data;
  }

  async updateStock(productId: string, quantity: number, reason?: string) {
    const response = await this.client.post("/inventory/update", {
      productId,
      quantity,
      reason,
    });
    return response.data;
  }

  async getStockAlerts() {
    const response = await this.client.get("/inventory/alerts");
    return response.data;
  }

  async resolveAlert(alertId: string) {
    const response = await this.client.post(`/inventory/alerts/${alertId}/resolve`);
    return response.data;
  }
}

export default new ApiService();
