import prisma from "../config/database";

export interface CreateRecipeDTO {
  name: string;
  description?: string;
  ingredients?: string;
  instructions?: string;
  cost: number;
  prepTime: number;
}

export class RecipeService {
  async createRecipe(data: CreateRecipeDTO) {
    return prisma.recipe.create({ data });
  }

  async getRecipes(filters?: { active?: boolean; skip?: number; take?: number }) {
    const { active = true, skip = 0, take = 50 } = filters || {};
    return prisma.recipe.findMany({
      where: { ...(active !== undefined ? { active } : {}) },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  }

  async getRecipeById(id: string) {
    return prisma.recipe.findUnique({ where: { id } });
  }

  async updateRecipe(id: string, data: Partial<CreateRecipeDTO>) {
    return prisma.recipe.update({ where: { id }, data });
  }

  async deleteRecipe(id: string) {
    return prisma.recipe.update({ where: { id }, data: { active: false } });
  }
}

export default new RecipeService();
