import { Router, Response } from "express";
import { z } from "zod";
import { UserRole } from "@prisma/client";
import loyaltyService from "../services/loyalty.service";
import { authMiddleware, AuthRequest, requireRole } from "../middleware/auth.middleware";
import logger from "../config/logger";

const router = Router();

const adjustSchema = z.object({
  points: z.number().int(),
  notes: z.string().optional(),
});

router.get(
  "/tiers",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (_req: AuthRequest, res: Response) => {
    try {
      const tiers = await loyaltyService.getTiers();
      res.json(tiers);
    } catch (error) {
      logger.error("Error fetching loyalty tiers:", error);
      res.status(500).json({ error: "Failed to fetch loyalty tiers" });
    }
  }
);

router.get(
  "/customers/:customerId",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const account = await loyaltyService.getAccount(req.params.customerId);
      if (!account) {
        const created = await loyaltyService.getOrCreateAccount(req.params.customerId);
        return res.json(created);
      }
      res.json(account);
    } catch (error) {
      logger.error("Error fetching loyalty account:", error);
      res.status(500).json({ error: "Failed to fetch loyalty account" });
    }
  }
);

router.get(
  "/customers/:customerId/transactions",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const transactions = await loyaltyService.listTransactions(req.params.customerId);
      res.json(transactions);
    } catch (error) {
      logger.error("Error fetching loyalty transactions:", error);
      res.status(500).json({ error: "Failed to fetch loyalty transactions" });
    }
  }
);

router.post(
  "/customers/:customerId/adjust",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const data = adjustSchema.parse(req.body);
      const account = await loyaltyService.getOrCreateAccount(req.params.customerId);
      await loyaltyService.adjustPoints({
        accountId: account.id,
        points: data.points,
        notes: data.notes,
      });
      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Error adjusting points:", error);
      res.status(400).json({ error: "Failed to adjust points" });
    }
  }
);

export default router;
