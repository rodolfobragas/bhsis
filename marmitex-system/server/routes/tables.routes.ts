import { Router, Response } from "express";
import { z } from "zod";
import { TableStatus, UserRole } from "@prisma/client";
import tableService from "../services/table.service";
import { authMiddleware, AuthRequest, requireRole } from "../middleware/auth.middleware";
import logger from "../config/logger";

const router = Router();

const tableSchema = z.object({
  name: z.string().min(1),
  capacity: z.number().int().positive().optional(),
  status: z.nativeEnum(TableStatus).optional(),
  location: z.string().optional(),
  active: z.boolean().optional(),
});

router.post(
  "/",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const data = tableSchema.parse(req.body);
      const table = await tableService.createTable(data);
      res.status(201).json(table);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Error creating table:", error);
      res.status(400).json({ error: "Failed to create table" });
    }
  }
);

router.get("/", authMiddleware, requireRole(UserRole.ADMIN, UserRole.MANAGER), async (req: AuthRequest, res: Response) => {
  try {
    const status = req.query.status as TableStatus | undefined;
    const active = req.query.active ? req.query.active === "true" : undefined;
    const tables = await tableService.getTables({ status, active });
    res.json(tables);
  } catch (error) {
    logger.error("Error fetching tables:", error);
    res.status(500).json({ error: "Failed to fetch tables" });
  }
});

router.get(
  "/:id",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const table = await tableService.getTableById(req.params.id);
      if (!table) return res.status(404).json({ error: "Table not found" });
      res.json(table);
    } catch (error) {
      logger.error("Error fetching table:", error);
      res.status(500).json({ error: "Failed to fetch table" });
    }
  }
);

router.put(
  "/:id",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const data = tableSchema.partial().parse(req.body);
      const table = await tableService.updateTable(req.params.id, data);
      res.json(table);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Error updating table:", error);
      res.status(400).json({ error: "Failed to update table" });
    }
  }
);

router.patch(
  "/:id/status",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const status = z.nativeEnum(TableStatus).parse(req.body.status);
      const table = await tableService.updateTable(req.params.id, { status });
      res.json(table);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Error updating table status:", error);
      res.status(400).json({ error: "Failed to update table status" });
    }
  }
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const table = await tableService.deactivateTable(req.params.id);
      res.json(table);
    } catch (error) {
      logger.error("Error deleting table:", error);
      res.status(400).json({ error: "Failed to delete table" });
    }
  }
);

export default router;
