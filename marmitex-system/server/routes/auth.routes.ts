import { Router, Request, Response } from "express";
import { z } from "zod";
import authService from "../services/auth.service";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import logger from "../config/logger";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    logger.error("Login error:", error);
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name } = registerSchema.parse(req.body);
    const result = await authService.register(email, password, name);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    logger.error("Register error:", error);
    res.status(400).json({ error: "Registration failed" });
  }
});

// Get current user
router.get("/me", authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

export default router;
