import prisma from "../config/database";
import logger from "../config/logger";
import { getSocketServer } from "../websocket/socket";

export class InventoryService {
  async getInventory(productId?: string) {
    return prisma.inventoryItem.findMany({
      where: {
        ...(productId && { productId }),
      },
      include: {
        product: true,
        movements: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  }

  async updateStock(
    productId: string,
    quantity: number,
    reason: string = "Manual adjustment"
  ) {
    const inventory = await prisma.inventoryItem.findUnique({
      where: { productId },
    });

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    const newQuantity = inventory.quantity + quantity;

    await prisma.inventoryItem.update({
      where: { productId },
      data: { quantity: newQuantity },
    });

    // Record movement
    await prisma.stockMovement.create({
      data: {
        inventoryId: inventory.id,
        type: quantity > 0 ? "IN" : "OUT",
        quantity: Math.abs(quantity),
        reason,
      },
    });

    // Check stock levels
    await this.checkStockLevels(inventory.id, productId, newQuantity);

    logger.info(`Stock updated for product ${productId}: ${newQuantity}`);
    return newQuantity;
  }

  async getStockAlerts() {
    return prisma.stockAlert.findMany({
      where: { resolved: false },
      include: {
        product: true,
        inventory: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async resolveAlert(alertId: string) {
    return prisma.stockAlert.update({
      where: { id: alertId },
      data: {
        resolved: true,
        resolvedAt: new Date(),
      },
    });
  }

  private async checkStockLevels(
    inventoryId: string,
    productId: string,
    quantity: number
  ) {
    const inventory = await prisma.inventoryItem.findUnique({
      where: { id: inventoryId },
    });

    if (!inventory) return;

    // Check for low stock
    if (quantity < inventory.minQuantity && quantity > 0) {
      const existingAlert = await prisma.stockAlert.findFirst({
        where: {
          productId,
          alertType: "LOW_STOCK",
          resolved: false,
        },
      });

      if (!existingAlert) {
        const alert = await prisma.stockAlert.create({
          data: {
            inventoryId,
            productId,
            alertType: "LOW_STOCK",
            quantity,
          },
        });
        logger.warn(`Low stock alert created for product ${productId}`);
        const io = getSocketServer();
        io?.to("role:ADMIN").emit("inventory:alert", alert);
        io?.to("role:MANAGER").emit("inventory:alert", alert);
      }
    }

    // Check for out of stock
    if (quantity === 0) {
      const existingAlert = await prisma.stockAlert.findFirst({
        where: {
          productId,
          alertType: "OUT_OF_STOCK",
          resolved: false,
        },
      });

      if (!existingAlert) {
        const alert = await prisma.stockAlert.create({
          data: {
            inventoryId,
            productId,
            alertType: "OUT_OF_STOCK",
            quantity: 0,
          },
        });
        logger.warn(`Out of stock alert created for product ${productId}`);
        const io = getSocketServer();
        io?.to("role:ADMIN").emit("inventory:alert", alert);
        io?.to("role:MANAGER").emit("inventory:alert", alert);
      }
    }

    // Check for overstock
    if (quantity > inventory.maxQuantity) {
      const existingAlert = await prisma.stockAlert.findFirst({
        where: {
          productId,
          alertType: "OVERSTOCK",
          resolved: false,
        },
      });

      if (!existingAlert) {
        await prisma.stockAlert.create({
          data: {
            inventoryId,
            productId,
            alertType: "OVERSTOCK",
            quantity,
          },
        });
        logger.warn(`Overstock alert created for product ${productId}`);
      }
    }
  }
}

export default new InventoryService();
