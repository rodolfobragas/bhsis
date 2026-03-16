import prisma from "../config/database";

export interface CreateProductDTO {
  name: string;
  sku: string;
  category: string;
  price: number;
  recipeId?: string;
}

export class ProductService {
  async createProduct(data: CreateProductDTO) {
    const product = await prisma.product.create({
      data,
    });

    // Create inventory item
    await prisma.inventoryItem.create({
      data: {
        productId: product.id,
        quantity: 0,
      },
    });

    return product;
  }

  async getProducts(filters?: {
    category?: string;
    active?: boolean;
    skip?: number;
    take?: number;
  }) {
    const { category, active = true, skip = 0, take = 50 } = filters || {};

    return prisma.product.findMany({
      where: {
        ...(category && { category }),
        ...(active !== undefined && { active }),
      },
      include: {
        recipe: true,
        inventoryItems: true,
      },
      skip,
      take,
    });
  }

  async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        recipe: true,
        inventoryItems: true,
      },
    });
  }

  async updateProduct(id: string, data: Partial<CreateProductDTO>) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        recipe: true,
        inventoryItems: true,
      },
    });
  }

  async deleteProduct(id: string) {
    return prisma.product.update({
      where: { id },
      data: { active: false },
    });
  }
}

export default new ProductService();
