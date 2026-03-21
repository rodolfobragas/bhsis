import { Router, Request, Response } from "express";
import { z } from "zod";
import { authMiddleware, requireRole, AuthRequest } from "../middleware/auth.middleware";
import { UserRole } from "../config/authDatabase";
import moduleService from "../services/module.service";
import logger from "../config/logger";

const router = Router();

const moduleSchema = z.object({
  key: z.string().min(2),
  label: z.string().min(2),
  description: z.string().optional().nullable(),
  premium: z.boolean().optional(),
  active: z.boolean().optional(),
  accesses: z
    .array(
      z.object({
        role: z.nativeEnum(UserRole),
        enabled: z.boolean(),
      })
    )
    .optional(),
});

const accessSchema = z.array(
  z.object({
    role: z.nativeEnum(UserRole),
    enabled: z.boolean(),
  })
);

router.get(
  "/",
  authMiddleware,
  requireRole(UserRole.ADMIN),
  async (_req: Request, res: Response) => {
    try {
      const modules = await moduleService.listModules();
      res.json(modules);
    } catch (error) {
      logger.error("Failed to list modules:", error);
      res.status(500).json({ error: "Failed to list modules" });
    }
  }
);

router.get("/access", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const modules = await moduleService.listAccessForRole(req.user.role);
    res.json(modules);
  } catch (error) {
    logger.error("Failed to list module access:", error);
    res.status(500).json({ error: "Failed to list module access" });
  }
});

router.post(
  "/",
  authMiddleware,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response) => {
    try {
      const data = moduleSchema.parse(req.body);
      const module = await moduleService.createModule(data);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Failed to create module:", error);
      res.status(400).json({ error: "Failed to create module" });
    }
  }
);

router.put(
  "/:id",
  authMiddleware,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response) => {
    try {
      const data = moduleSchema.parse(req.body);
      const module = await moduleService.updateModule(req.params.id, data);
      res.json(module);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Failed to update module:", error);
      res.status(400).json({ error: "Failed to update module" });
    }
  }
);

router.put(
  "/:id/access",
  authMiddleware,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response) => {
    try {
      const data = accessSchema.parse(req.body);
      const module = await moduleService.updateModuleAccess(req.params.id, data);
      res.json(module);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Failed to update module access:", error);
      res.status(400).json({ error: "Failed to update module access" });
    }
  }
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole(UserRole.ADMIN),
  async (req: Request, res: Response) => {
    try {
      await moduleService.deleteModule(req.params.id);
      res.status(204).send();
    } catch (error) {
      logger.error("Failed to delete module:", error);
      res.status(400).json({ error: "Failed to delete module" });
    }
  }
);

export default router;
