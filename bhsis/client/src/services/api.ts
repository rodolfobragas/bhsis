import axios, { AxiosInstance } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.toString() ||
  `${window.location.origin}/api`;

class ApiService {
  private client: AxiosInstance;
  private maxRetries = 2;
  private baseRetryDelayMs = 500;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
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
      async (error) => {
        const status = error.response?.status as number | undefined;
        const config = error.config as any;

        if (config && (!status || status >= 500)) {
          config.__retryCount = config.__retryCount ?? 0;
          if (config.__retryCount < this.maxRetries) {
            config.__retryCount += 1;
            const delay = this.baseRetryDelayMs * config.__retryCount;
            await new Promise((resolve) => setTimeout(resolve, delay));
            return this.client.request(config);
          }
        }

        if (status === 401) {
          localStorage.removeItem("auth_token");
          window.location.href = "/";
        }

        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Erro inesperado";

        return Promise.reject(new Error(message));
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
    return response.data.user ?? response.data;
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

  async createCheckoutSession(orderId: string) {
    const response = await this.client.post("/payments/checkout-session", { orderId });
    return response.data;
  }

  async createPaymentIntent(orderId: string) {
    const response = await this.client.post("/payments/intent", { orderId });
    return response.data;
  }

  async getPaymentsByOrder(orderId: string) {
    const response = await this.client.get(`/payments/orders/${orderId}`);
    return response.data;
  }

  async listPayments(params?: { from?: string; to?: string; status?: string }) {
    const response = await this.client.get("/payments", { params });
    return response.data;
  }

  async refundPayment(paymentId: string, amount?: number) {
    const response = await this.client.post(`/payments/${paymentId}/refund`, amount ? { amount } : {});
    return response.data;
  }

  async getPaymentReport(params?: { from?: string; to?: string }) {
    const response = await this.client.get("/payments/report", { params });
    return response.data;
  }

  async createOrder(data: {
    customerId: string;
    items: Array<{ productId: string; quantity: number }>;
    notes?: string;
    couponCode?: string;
    loyaltyPointsToRedeem?: number;
    tableId?: string;
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

  // Recipes endpoints
  async getRecipes(filters?: { skip?: number; take?: number }) {
    const response = await this.client.get("/recipes", { params: filters });
    return response.data;
  }

  async getRecipeById(id: string) {
    const response = await this.client.get(`/recipes/${id}`);
    return response.data;
  }

  async createRecipe(data: any) {
    const response = await this.client.post("/recipes", data);
    return response.data;
  }

  async updateRecipe(id: string, data: any) {
    const response = await this.client.put(`/recipes/${id}`, data);
    return response.data;
  }

  async deleteRecipe(id: string) {
    const response = await this.client.delete(`/recipes/${id}`);
    return response.data;
  }

  // Coupons endpoints
  async getCoupons(filters?: { active?: boolean; code?: string }) {
    const response = await this.client.get("/coupons", { params: filters });
    return response.data;
  }

  async createCoupon(data: any) {
    const response = await this.client.post("/coupons", data);
    return response.data;
  }

  async updateCoupon(id: string, data: any) {
    const response = await this.client.put(`/coupons/${id}`, data);
    return response.data;
  }

  async deleteCoupon(id: string) {
    const response = await this.client.delete(`/coupons/${id}`);
    return response.data;
  }

  async validateCoupon(code: string, subtotal: number) {
    const response = await this.client.get("/coupons/validate", { params: { code, subtotal } });
    return response.data;
  }

  // Loyalty endpoints
  async getLoyaltyAccount(customerId: string) {
    const response = await this.client.get(`/loyalty/customers/${customerId}`);
    return response.data;
  }

  async getLoyaltyTransactions(customerId: string) {
    const response = await this.client.get(`/loyalty/customers/${customerId}/transactions`);
    return response.data;
  }

  async getLoyaltyTiers() {
    const response = await this.client.get("/loyalty/tiers");
    return response.data;
  }

  async adjustLoyaltyPoints(customerId: string, points: number, notes?: string) {
    const response = await this.client.post(`/loyalty/customers/${customerId}/adjust`, {
      points,
      notes,
    });
    return response.data;
  }

  // Tables endpoints
  async getTables(filters?: { status?: string; active?: boolean }) {
    const response = await this.client.get("/tables", { params: filters });
    return response.data;
  }

  // Modules (admin)
  async getModules() {
    const response = await this.client.get("/modules");
    return response.data;
  }

  async createModule(data: any) {
    const response = await this.client.post("/modules", data);
    return response.data;
  }

  async updateModule(id: string, data: any) {
    const response = await this.client.put(`/modules/${id}`, data);
    return response.data;
  }

  async updateModuleAccess(id: string, accesses: any[]) {
    const response = await this.client.put(`/modules/${id}/access`, accesses);
    return response.data;
  }

  async deleteModule(id: string) {
    await this.client.delete(`/modules/${id}`);
  }

  async getModuleAccess() {
    const response = await this.client.get("/modules/access");
    return response.data;
  }

  async createTable(data: any) {
    const response = await this.client.post("/tables", data);
    return response.data;
  }

  async updateTable(id: string, data: any) {
    const response = await this.client.put(`/tables/${id}`, data);
    return response.data;
  }

  async updateTableStatus(id: string, status: string) {
    const response = await this.client.patch(`/tables/${id}/status`, { status });
    return response.data;
  }

  async deleteTable(id: string) {
    const response = await this.client.delete(`/tables/${id}`);
    return response.data;
  }
}

export default new ApiService();
