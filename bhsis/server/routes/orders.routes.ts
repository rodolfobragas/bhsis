import { Router, Response } from "express";
import { z } from "zod";
import orderService from "../services/order.service";
import { authMiddleware, AuthRequest, requireRole } from "../middleware/auth.middleware";
import { UserRole } from "../config/authDatabase";
import { OrderStatus } from "../../prisma/generated/food";
import logger from "../config/logger";

const router = Router();

const createOrderSchema = z.object({
  customerId: z.string(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
    })
  ),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
  loyaltyPointsToRedeem: z.number().int().nonnegative().optional(),
  tableId: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

// Create order
router.post(
  "/",
  authMiddleware,
  requireRole(UserRole.ATTENDANT, UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const data = createOrderSchema.parse(req.body);
      const order = await orderService.createOrder(data);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Error creating order:", error);
      res.status(400).json({ error: "Failed to create order" });
    }
  }
);

// Get all orders
router.get(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 50;
      const status = req.query.status as OrderStatus | undefined;

      const orders = await orderService.getOrders({
        status,
        skip,
        take,
      });

      res.json(orders);
    } catch (error) {
      logger.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  }
);

// Get order by ID
router.get(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const order = await orderService.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      logger.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  }
);

// Update order status
router.patch(
  "/:id/status",
  authMiddleware,
  requireRole(UserRole.KITCHEN, UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const { status } = updateStatusSchema.parse(req.body);
      const order = await orderService.updateOrderStatus(req.params.id, status);
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Error updating order status:", error);
      res.status(400).json({ error: "Failed to update order" });
    }
  }
);

// Cancel order
router.post(
  "/:id/cancel",
  authMiddleware,
  requireRole(UserRole.ATTENDANT, UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const order = await orderService.cancelOrder(req.params.id);
      res.json(order);
    } catch (error) {
      logger.error("Error cancelling order:", error);
      res.status(400).json({ error: "Failed to cancel order" });
    }
  }
);

export default router;
