import { Router, Response } from "express";
import { z } from "zod";
import recipeService from "../services/recipe.service";
import { authMiddleware, AuthRequest, requireRole } from "../middleware/auth.middleware";
import { UserRole } from "../config/authDatabase";
import logger from "../config/logger";

const router = Router();

const recipeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  instructions: z.string().optional(),
  cost: z.number().nonnegative(),
  prepTime: z.number().int().positive(),
});

router.post(
  "/",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const data = recipeSchema.parse(req.body);
      const recipe = await recipeService.createRecipe(data);
      res.status(201).json(recipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Error creating recipe:", error);
      res.status(400).json({ error: "Failed to create recipe" });
    }
  }
);

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 50;
    const recipes = await recipeService.getRecipes({ skip, take });
    res.json(recipes);
  } catch (error) {
    logger.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const recipe = await recipeService.getRecipeById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json(recipe);
  } catch (error) {
    logger.error("Error fetching recipe:", error);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

router.put(
  "/:id",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const data = recipeSchema.partial().parse(req.body);
      const recipe = await recipeService.updateRecipe(req.params.id, data);
      res.json(recipe);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Error updating recipe:", error);
      res.status(400).json({ error: "Failed to update recipe" });
    }
  }
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const recipe = await recipeService.deleteRecipe(req.params.id);
      res.json(recipe);
    } catch (error) {
      logger.error("Error deleting recipe:", error);
      res.status(400).json({ error: "Failed to delete recipe" });
    }
  }
);

export default router;
