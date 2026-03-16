import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_email');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(name: string, email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await this.client.post('/auth/register', { name, email, password });
    return response.data;
  }

  async getCurrentUser(): Promise<any> {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Products endpoints
  async getProducts(page = 1, limit = 10, search?: string): Promise<PaginatedResponse<any>> {
    const params: any = { page, limit };
    if (search) params.search = search;
    const response = await this.client.get('/products', { params });
    return response.data;
  }

  async getProduct(id: string): Promise<any> {
    const response = await this.client.get(`/products/${id}`);
    return response.data;
  }

  async createProduct(data: any): Promise<any> {
    const response = await this.client.post('/products', data);
    return response.data;
  }

  async updateProduct(id: string, data: any): Promise<any> {
    const response = await this.client.put(`/products/${id}`, data);
    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.client.delete(`/products/${id}`);
  }

  // Customers endpoints
  async getCustomers(page = 1, limit = 10, search?: string): Promise<PaginatedResponse<any>> {
    const params: any = { page, limit };
    if (search) params.search = search;
    const response = await this.client.get('/customers', { params });
    return response.data;
  }

  async getCustomer(id: string): Promise<any> {
    const response = await this.client.get(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(data: any): Promise<any> {
    const response = await this.client.post('/customers', data);
    return response.data;
  }

  async updateCustomer(id: string, data: any): Promise<any> {
    const response = await this.client.put(`/customers/${id}`, data);
    return response.data;
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.client.delete(`/customers/${id}`);
  }

  // Orders endpoints
  async getOrders(page = 1, limit = 10, filters?: any): Promise<PaginatedResponse<any>> {
    const params: any = { page, limit, ...filters };
    const response = await this.client.get('/orders', { params });
    return response.data;
  }

  async getOrder(id: string): Promise<any> {
    const response = await this.client.get(`/orders/${id}`);
    return response.data;
  }

  async createOrder(data: any): Promise<any> {
    const response = await this.client.post('/orders', data);
    return response.data;
  }

  async updateOrder(id: string, data: any): Promise<any> {
    const response = await this.client.put(`/orders/${id}`, data);
    return response.data;
  }

  async updateOrderStatus(id: string, status: string): Promise<any> {
    const response = await this.client.patch(`/orders/${id}/status`, { status });
    return response.data;
  }

  async deleteOrder(id: string): Promise<void> {
    await this.client.delete(`/orders/${id}`);
  }

  // Inventory endpoints
  async getInventory(page = 1, limit = 10): Promise<PaginatedResponse<any>> {
    const response = await this.client.get('/inventory', { params: { page, limit } });
    return response.data;
  }

  async getInventoryItem(id: string): Promise<any> {
    const response = await this.client.get(`/inventory/${id}`);
    return response.data;
  }

  async updateInventoryStock(id: string, quantity: number): Promise<any> {
    const response = await this.client.patch(`/inventory/${id}/stock`, { quantity });
    return response.data;
  }

  async getStockAlerts(): Promise<any[]> {
    const response = await this.client.get('/inventory/alerts');
    return response.data;
  }

  // Recipes endpoints
  async getRecipes(page = 1, limit = 10): Promise<PaginatedResponse<any>> {
    const response = await this.client.get('/recipes', { params: { page, limit } });
    return response.data;
  }

  async getRecipe(id: string): Promise<any> {
    const response = await this.client.get(`/recipes/${id}`);
    return response.data;
  }

  async createRecipe(data: any): Promise<any> {
    const response = await this.client.post('/recipes', data);
    return response.data;
  }

  async updateRecipe(id: string, data: any): Promise<any> {
    const response = await this.client.put(`/recipes/${id}`, data);
    return response.data;
  }

  async deleteRecipe(id: string): Promise<void> {
    await this.client.delete(`/recipes/${id}`);
  }

  // Health check
  async healthCheck(): Promise<any> {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export const apiClient = new ApiClient();
