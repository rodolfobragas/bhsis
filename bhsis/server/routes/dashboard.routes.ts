import { Router, Request, Response } from "express";
import dashboardService from "../services/dashboard.service";
import logger from "../config/logger";

const router = Router();

router.get("/summary", async (req: Request, res: Response) => {
  try {
    const startDate = typeof req.query.startDate === "string" ? req.query.startDate : undefined;
    const endDate = typeof req.query.endDate === "string" ? req.query.endDate : undefined;
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const summary = await dashboardService.getSummary({ startDate, endDate, category });
    res.json(summary);
  } catch (error) {
    logger.error("Failed to load dashboard summary:", error);
    res.status(500).json({ error: "Failed to load dashboard summary" });
  }
});

export default router;
