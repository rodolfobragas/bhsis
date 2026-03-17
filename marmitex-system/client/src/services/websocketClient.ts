import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

interface OrderEvent {
  id: string;
  orderNumber?: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  total: number;
  createdAt: string;
  updatedAt: string;
}

interface StockAlertEvent {
  productId: string;
  productName: string;
  currentStock: number;
  minimumStock: number;
  severity: 'critical' | 'warning';
}

interface LoyaltyPointsEvent {
  accountId: string;
  customerId?: string;
  delta: number;
  balance: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
}

interface ConnectionStatus {
  connected: boolean;
  error?: string;
}

type OrderCallback = (order: OrderEvent) => void;
type StockAlertCallback = (alert: StockAlertEvent) => void;
type LoyaltyCallback = (event: LoyaltyPointsEvent) => void;
type StatusCallback = (status: ConnectionStatus) => void;

class WebSocketClient {
  private socket: Socket | null = null;
  private orderCallbacks: OrderCallback[] = [];
  private stockAlertCallbacks: StockAlertCallback[] = [];
  private loyaltyCallbacks: LoyaltyCallback[] = [];
  private statusCallbacks: StatusCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const auth = token ? { token } : {};
        
        this.socket = io(WS_URL, {
          auth,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: this.maxReconnectAttempts,
          transports: ['websocket', 'polling'],
        });

        this.socket.on('connect', () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.notifyStatus({ connected: true });
          resolve();
        });

        this.socket.on('disconnect', () => {
          console.log('WebSocket disconnected');
          this.notifyStatus({ connected: false });
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          this.notifyStatus({ connected: false, error: error.message });
          reject(error);
        });

        // Order events
        this.socket.on('order:new', (order: OrderEvent) => {
          console.log('New order:', order);
          this.notifyOrderCallbacks(order);
        });

        this.socket.on('order:updated', (order: OrderEvent) => {
          console.log('Order updated:', order);
          this.notifyOrderCallbacks(order);
        });

        this.socket.on('order:completed', (order: OrderEvent) => {
          console.log('Order completed:', order);
          this.notifyOrderCallbacks(order);
        });

        // Stock alert events
        this.socket.on('inventory:alert', (alert: StockAlertEvent) => {
          console.log('Stock alert:', alert);
          this.notifyStockAlertCallbacks(alert);
        });

        this.socket.on('inventory:critical', (alert: StockAlertEvent) => {
          console.log('Critical stock alert:', alert);
          this.notifyStockAlertCallbacks(alert);
        });

        // Kitchen events
        this.socket.on('kitchen:order-ready', (order: OrderEvent) => {
          console.log('Order ready in kitchen:', order);
          this.notifyOrderCallbacks(order);
        });

        // Loyalty events
        this.socket.on('loyalty:points', (event: LoyaltyPointsEvent) => {
          console.log('Loyalty points update:', event);
          this.notifyLoyaltyCallbacks(event);
        });
      } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Subscribe to order events
  onOrderCreated(callback: OrderCallback): () => void {
    this.orderCallbacks.push(callback);
    return () => {
      this.orderCallbacks = this.orderCallbacks.filter(cb => cb !== callback);
    };
  }

  // Subscribe to stock alerts
  onStockAlert(callback: StockAlertCallback): () => void {
    this.stockAlertCallbacks.push(callback);
    return () => {
      this.stockAlertCallbacks = this.stockAlertCallbacks.filter(cb => cb !== callback);
    };
  }

  // Subscribe to loyalty events
  onLoyaltyPoints(callback: LoyaltyCallback): () => void {
    this.loyaltyCallbacks.push(callback);
    return () => {
      this.loyaltyCallbacks = this.loyaltyCallbacks.filter(cb => cb !== callback);
    };
  }

  // Subscribe to connection status
  onStatusChange(callback: StatusCallback): () => void {
    this.statusCallbacks.push(callback);
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
    };
  }

  // Emit events
  updateOrderStatus(orderId: string, status: string): void {
    if (this.socket?.connected) {
      this.socket.emit('order:status-updated', { id: orderId, status });
    }
  }

  joinKitchenRoom(userId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join-room', { role: 'KITCHEN', userId });
    }
  }

  joinAdminRoom(userId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join-room', { role: 'ADMIN', userId });
    }
  }

  joinManagerRoom(userId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('join-room', { role: 'MANAGER', userId });
    }
  }

  leaveRoom(room: string): void {
    if (this.socket?.connected) {
      this.socket.emit('leave-room', { room });
    }
  }

  // Private helpers
  private notifyOrderCallbacks(order: OrderEvent): void {
    this.orderCallbacks.forEach(callback => {
      try {
        callback(order);
      } catch (error) {
        console.error('Error in order callback:', error);
      }
    });
  }

  private notifyStockAlertCallbacks(alert: StockAlertEvent): void {
    this.stockAlertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Error in stock alert callback:', error);
      }
    });
  }

  private notifyLoyaltyCallbacks(event: LoyaltyPointsEvent): void {
    this.loyaltyCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in loyalty callback:', error);
      }
    });
  }

  private notifyStatus(status: ConnectionStatus): void {
    this.statusCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in status callback:', error);
      }
    });
  }
}

export const wsClient = new WebSocketClient();
