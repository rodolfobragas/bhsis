import { Server, Socket } from "socket.io";
import logger from "../config/logger";

export function setupWebSocketEvents(io: Server) {
  io.on("connection", (socket: Socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Join room based on user role
    socket.on("join-room", (data: { role: string; userId: string }) => {
      socket.join(`role:${data.role}`);
      socket.join(`user:${data.userId}`);
      logger.info(
        `User ${data.userId} joined room: role:${data.role}`
      );
    });

    // Order events
    socket.on("order:created", (data) => {
      io.to("role:KITCHEN").emit("order:new", data);
      io.to("role:ADMIN").emit("order:new", data);
      logger.info(`Order created event emitted: ${data.id}`);
    });

    socket.on("order:status-updated", (data) => {
      io.to("role:ATTENDANT").emit("order:updated", data);
      io.to("role:ADMIN").emit("order:updated", data);
      logger.info(`Order status updated: ${data.id} -> ${data.status}`);
    });

    socket.on("order:completed", (data) => {
      io.emit("order:completed", data);
      logger.info(`Order completed: ${data.id}`);
    });

    // Delivery events
    socket.on("delivery:created", (data) => {
      io.emit("delivery:new", data);
      logger.info(`Delivery created: ${data.id}`);
    });

    socket.on("delivery:status-updated", (data) => {
      io.to("role:ATTENDANT").emit("delivery:updated", data);
      io.to("role:ADMIN").emit("delivery:updated", data);
      if (data.motoboyId) {
        io.to(`user:${data.motoboyId}`).emit("delivery:updated", data);
      }
      logger.info(`Delivery status updated: ${data.id} -> ${data.status}`);
    });

    socket.on("delivery:position", (payload) => {
      io.to("role:ADMIN").emit("delivery:position", payload);
      io.to("role:ATTENDANT").emit("delivery:position", payload);
      if (payload.motoboyId) {
        io.to(`user:${payload.motoboyId}`).emit("delivery:position", payload);
      }
      logger.info(`Delivery position broadcast for motoboy ${payload.motoboyId}`);
    });

    socket.on("delivery:next", (payload) => {
      io.to("role:ADMIN").emit("delivery:next", payload);
      logger.info(`Next delivery for motoboy ${payload.motoboyId}`);
    });

    // Inventory events
    socket.on("inventory:alert", (data) => {
      io.to("role:ADMIN").emit("inventory:alert", data);
      io.to("role:MANAGER").emit("inventory:alert", data);
      logger.info(`Inventory alert: ${data.productId} - ${data.alertType}`);
    });

    socket.on("inventory:updated", (data) => {
      io.emit("inventory:updated", data);
      logger.info(`Inventory updated: ${data.productId}`);
    });

    // Disconnect
    socket.on("disconnect", () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });

    // Error handling
    socket.on("error", (error) => {
      logger.error(`Socket error: ${error}`);
    });
  });
}
