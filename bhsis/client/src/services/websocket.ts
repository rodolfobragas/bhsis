import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.VITE_SOCKET_URL || "http://localhost:3001";

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(userId: string, role: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("WebSocket connected");
      this.socket?.emit("join-room", { userId, role });
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
    });

    this.socket.on("error", (error: any) => {
      console.error("WebSocket error:", error);
    });

    // Setup event listeners
    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    // Order events
    this.socket.on("order:new", (data: any) => {
      this.emit("order:new", data);
    });

    this.socket.on("order:updated", (data: any) => {
      this.emit("order:updated", data);
    });

    this.socket.on("order:completed", (data: any) => {
      this.emit("order:completed", data);
    });

    // Inventory events
    this.socket.on("inventory:alert", (data: any) => {
      this.emit("inventory:alert", data);
    });

    this.socket.on("inventory:updated", (data: any) => {
      this.emit("inventory:updated", data);
    });
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  emitOrderCreated(data: any) {
    this.socket?.emit("order:created", data);
  }

  emitOrderStatusUpdated(data: any) {
    this.socket?.emit("order:status-updated", data);
  }

  emitInventoryAlert(data: any) {
    this.socket?.emit("inventory:alert", data);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new WebSocketService();
