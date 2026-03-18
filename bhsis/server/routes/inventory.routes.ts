import { Router, Response } from "express";
import { z } from "zod";
import inventoryService from "../services/inventory.service";
import { authMiddleware, AuthRequest, requireRole } from "../middleware/auth.middleware";
import { UserRole } from "@prisma/client";
import logger from "../config/logger";

const router = Router();

const updateStockSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
  reason: z.string().optional(),
});

// Get all inventory
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const productId = req.query.productId as string | undefined;
    const inventory = await inventoryService.getInventory(productId);
    res.json(inventory);
  } catch (error) {
    logger.error("Error fetching inventory:", error);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

// Update stock
router.post(
  "/update",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const { productId, quantity, reason } = updateStockSchema.parse(req.body);
      const newQuantity = await inventoryService.updateStock(
        productId,
        quantity,
        reason
      );
      res.json({ productId, quantity: newQuantity });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Error updating stock:", error);
      res.status(400).json({ error: "Failed to update stock" });
    }
  }
);

// Get stock alerts
router.get(
  "/alerts",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const alerts = await inventoryService.getStockAlerts();
      res.json(alerts);
    } catch (error) {
      logger.error("Error fetching alerts:", error);
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  }
);

// Resolve alert
router.post(
  "/alerts/:id/resolve",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const alert = await inventoryService.resolveAlert(req.params.id);
      res.json(alert);
    } catch (error) {
      logger.error("Error resolving alert:", error);
      res.status(400).json({ error: "Failed to resolve alert" });
    }
  }
);

export default router;
