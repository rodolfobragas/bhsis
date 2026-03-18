import { Router } from "express";
import { z } from "zod";
import { DeliveryStatus, UserRole } from "@prisma/client";
import { authMiddleware, AuthRequest, requireRole } from "../middleware/auth.middleware";
import deliveryService from "../services/delivery.service";

const router = Router();

const createDeliverySchema = z.object({
  orderId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  endereco: z.string(),
  motoboyId: z.string().optional(),
  previsaoEntrega: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.nativeEnum(DeliveryStatus),
});

const positionSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  speed: z.number().optional(),
  timestamp: z.string().optional(),
  motoboyId: z.string().optional(),
  status: z.nativeEnum(DeliveryStatus).optional(),
});

const listFilterSchema = z.object({
  motoboyId: z.string().optional(),
  status: z.nativeEnum(DeliveryStatus).optional(),
});

router.use(authMiddleware);

router.get("/", async (req, res) => {
  const filter = listFilterSchema.parse(req.query);
  const deliveries = await deliveryService.list(filter);
  res.json(deliveries);
});

router.get("/:id", async (req, res) => {
  const delivery = await deliveryService.getById(req.params.id);
  if (!delivery) {
    return res.status(404).json({ error: "Entrega não encontrada" });
  }
  res.json(delivery);
});

router.post(
  "/",
  requireRole(UserRole.ADMIN, UserRole.ATTENDANT),
  async (req: AuthRequest, res) => {
    try {
      const payload = createDeliverySchema.parse(req.body);
      const delivery = await deliveryService.create(payload);
      res.status(201).json(delivery);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

router.patch(
  "/:id/status",
  requireRole(UserRole.ADMIN, UserRole.KITCHEN),
  async (req, res) => {
    try {
      const { status } = updateStatusSchema.parse(req.body);
      const delivery = await deliveryService.updateStatus(req.params.id, status);
      res.json(delivery);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

router.post("/:id/position", async (req, res) => {
  try {
    const payload = positionSchema.parse(req.body);
    const position = await deliveryService.recordPosition(req.params.id, payload);
    res.json(position);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
