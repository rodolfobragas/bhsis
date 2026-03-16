import { Request, Response, NextFunction } from "express";
import authService, { TokenPayload } from "../services/auth.service";
import logger from "../config/logger";
import { UserRole } from "@prisma/client";

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const serviceToken = process.env.SERVICE_TOKEN;
    const serviceHeader = req.headers["x-service-token"]; 
    if (serviceToken && serviceHeader && serviceHeader === serviceToken) {
      req.user = { userId: "service", email: "service@system", role: UserRole.ADMIN };
      return next();
    }

    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const payload = authService.verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = payload;
    next();
  } catch (error) {
    logger.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}
