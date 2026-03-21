import { Router, Response } from "express";
import { z } from "zod";
import { UserRole } from "../config/authDatabase";
import { CouponType } from "../../prisma/generated/food";
import couponService from "../services/coupon.service";
import { authMiddleware, AuthRequest, requireRole } from "../middleware/auth.middleware";
import logger from "../config/logger";

const router = Router();

const couponSchema = z.object({
  code: z.string().min(2),
  description: z.string().optional(),
  type: z.nativeEnum(CouponType),
  value: z.number().positive(),
  minOrder: z.number().nonnegative().optional(),
  maxDiscount: z.number().positive().optional(),
  maxUses: z.number().int().positive().optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
});

router.post(
  "/",
  authMiddleware,
  requireRole(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const data = couponSchema.parse(req.body);
      const coupon = await couponService.createCoupon({
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
      });
      res.status(201).json(coupon);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Error creating coupon:", error);
      res.status(400).json({ error: "Failed to create coupon" });
    }
  }
);

router.get("/", authMiddleware, requireRole(UserRole.ADMIN), async (req: AuthRequest, res: Response) => {
  try {
    const active = req.query.active ? req.query.active === "true" : undefined;
    const code = req.query.code as string | undefined;
    const coupons = await couponService.getCoupons({ active, code });
    res.json(coupons);
  } catch (error) {
    logger.error("Error fetching coupons:", error);
    res.status(500).json({ error: "Failed to fetch coupons" });
  }
});

router.get("/validate", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const code = req.query.code as string | undefined;
    const subtotal = Number(req.query.subtotal ?? 0);
    if (!code) {
      return res.status(400).json({ error: "Coupon code required" });
    }
    const result = await couponService.validateCoupon({ code, subtotal });
    res.json({ coupon: result.coupon, discount: result.discount });
  } catch (error) {
    logger.error("Error validating coupon:", error);
    res.status(400).json({ error: (error as Error).message ?? "Invalid coupon" });
  }
});

router.get(
  "/:id",
  authMiddleware,
  requireRole(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const coupon = await couponService.getCouponById(req.params.id);
      if (!coupon) return res.status(404).json({ error: "Coupon not found" });
      res.json(coupon);
    } catch (error) {
      logger.error("Error fetching coupon:", error);
      res.status(500).json({ error: "Failed to fetch coupon" });
    }
  }
);

router.put(
  "/:id",
  authMiddleware,
  requireRole(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const data = couponSchema.partial().parse(req.body);
      const coupon = await couponService.updateCoupon(req.params.id, {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
      });
      res.json(coupon);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Error updating coupon:", error);
      res.status(400).json({ error: "Failed to update coupon" });
    }
  }
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const coupon = await couponService.deactivateCoupon(req.params.id);
      res.json(coupon);
    } catch (error) {
      logger.error("Error deleting coupon:", error);
      res.status(400).json({ error: "Failed to delete coupon" });
    }
  }
);

export default router;
