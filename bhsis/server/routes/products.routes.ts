import { Router, Response } from "express";
import { z } from "zod";
import productService from "../services/product.service";
import { authMiddleware, AuthRequest, requireRole } from "../middleware/auth.middleware";
import { UserRole } from "../config/authDatabase";
import logger from "../config/logger";

const router = Router();

const createProductSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  recipeId: z.string().optional(),
});

// Create product
router.post(
  "/",
  authMiddleware,
  requireRole(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const data = createProductSchema.parse(req.body);
      const product = await productService.createProduct(data);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Error creating product:", error);
      res.status(400).json({ error: "Failed to create product" });
    }
  }
);

// Get all products
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 50;

    const products = await productService.getProducts({
      category,
      skip,
      take,
    });

    res.json(products);
  } catch (error) {
    logger.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get product by ID
router.get(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      logger.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  }
);

// Update product
router.put(
  "/:id",
  authMiddleware,
  requireRole(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const data = createProductSchema.partial().parse(req.body);
      const product = await productService.updateProduct(req.params.id, data);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Error updating product:", error);
      res.status(400).json({ error: "Failed to update product" });
    }
  }
);

// Delete product (soft delete)
router.delete(
  "/:id",
  authMiddleware,
  requireRole(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const product = await productService.deleteProduct(req.params.id);
      res.json(product);
    } catch (error) {
      logger.error("Error deleting product:", error);
      res.status(400).json({ error: "Failed to delete product" });
    }
  }
);

export default router;
