import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { Server as SocketServer } from "socket.io";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic } from "./serveStatic";
import { setupWebSocketEvents } from "../websocket/events";
import { setSocketServer } from "../websocket/socket";
import deliveryRoutes from "../routes/delivery.routes";
import dashboardRoutes from "../routes/dashboard.routes";
import authRoutes from "../routes/auth.routes";
import ordersRoutes from "../routes/orders.routes";
import productsRoutes from "../routes/products.routes";
import customersRoutes from "../routes/customers.routes";
import inventoryRoutes from "../routes/inventory.routes";
import couponsRoutes from "../routes/coupons.routes";
import loyaltyRoutes from "../routes/loyalty.routes";
import tablesRoutes from "../routes/tables.routes";
import recipesRoutes from "../routes/recipes.routes";
import { paymentsRoutes, paymentsWebhookRoutes } from "../routes/payments.routes";
import modulesRoutes from "../routes/modules.routes";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  const io = new SocketServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
  setSocketServer(io);
  setupWebSocketEvents(io);
  app.use(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    paymentsWebhookRoutes
  );
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  app.use("/api/auth", authRoutes);
  app.use("/api/deliveries", deliveryRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/orders", ordersRoutes);
  app.use("/api/products", productsRoutes);
  app.use("/api/customers", customersRoutes);
  app.use("/api/inventory", inventoryRoutes);
  app.use("/api/coupons", couponsRoutes);
  app.use("/api/loyalty", loyaltyRoutes);
  app.use("/api/tables", tablesRoutes);
  app.use("/api/recipes", recipesRoutes);
  app.use("/api/payments", paymentsRoutes);
  app.use("/api/modules", modulesRoutes);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
