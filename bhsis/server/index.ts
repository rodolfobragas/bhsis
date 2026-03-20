import express from "express";
import cors from "cors";
import "express-async-errors";
import { createServer } from "http";
import { Server } from "socket.io";
import logger from "./config/logger";
import { initRedis, closeRedis } from "./config/redis";
import { errorHandler } from "./middleware/error.middleware";
import { setupWebSocketEvents } from "./websocket/events";

// Routes
import authRoutes from "./routes/auth.routes";
import ordersRoutes from "./routes/orders.routes";
import productsRoutes from "./routes/products.routes";
import customersRoutes from "./routes/customers.routes";
import inventoryRoutes from "./routes/inventory.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import couponsRoutes from "./routes/coupons.routes";
import loyaltyRoutes from "./routes/loyalty.routes";
import tablesRoutes from "./routes/tables.routes";
import recipesRoutes from "./routes/recipes.routes";
import { paymentsRoutes, paymentsWebhookRoutes } from "./routes/payments.routes";
import modulesRoutes from "./routes/modules.routes";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use("/api/payments/webhook", express.raw({ type: "application/json" }), paymentsWebhookRoutes);
app.use(express.json());
app.use(cors());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/customers", customersRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/coupons", couponsRoutes);
app.use("/api/loyalty", loyaltyRoutes);
app.use("/api/tables", tablesRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/modules", modulesRoutes);

// WebSocket events
setupWebSocketEvents(io);

// Error handling
app.use(errorHandler);

// Initialize server
async function start() {
  try {
    // Initialize Redis
    await initRedis();

    const PORT = process.env.PORT || 3001;
    httpServer.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");
  await closeRedis();
  httpServer.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

start();

export { app, io };
