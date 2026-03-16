import prisma from "../config/database";
import { OrderStatus } from "@prisma/client";
import logger from "../config/logger";

export interface CreateOrderDTO {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  notes?: string;
}

export class OrderService {
  async createOrder(data: CreateOrderDTO) {
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;

      // Get products and calculate total
      const products = await prisma.product.findMany({
        where: {
          id: { in: data.items.map((item) => item.productId) },
        },
      });

      let subtotal = 0;
      const orderItems = data.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        return {
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
          total: itemTotal,
        };
      });

      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;

      // Create order with items
      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerId: data.customerId,
          status: OrderStatus.PENDING,
          subtotal,
          tax,
          total,
          notes: data.notes,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: true,
        },
      });

      // Update inventory
      for (const item of data.items) {
        await this.updateInventory(item.productId, item.quantity, "OUT");
      }

      logger.info(`Order created: ${orderNumber}`);
      return order;
    } catch (error) {
      logger.error("Error creating order:", error);
      throw error;
    }
  }

  async getOrders(filters?: {
    customerId?: string;
    status?: OrderStatus;
    skip?: number;
    take?: number;
  }) {
    const { customerId, status, skip = 0, take = 50 } = filters || {};

    return prisma.order.findMany({
      where: {
        ...(customerId && { customerId }),
        ...(status && { status }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    });
  }

  async getOrderById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    });
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        ...(status === OrderStatus.DELIVERED && {
          completedAt: new Date(),
        }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    logger.info(`Order ${id} status updated to ${status}`);
    return order;
  }

  async cancelOrder(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) throw new Error("Order not found");

    // Restore inventory
    for (const item of order.items) {
      await this.updateInventory(item.productId, item.quantity, "IN");
    }

    return prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  private async updateInventory(
    productId: string,
    quantity: number,
    type: "IN" | "OUT"
  ) {
    const inventory = await prisma.inventoryItem.findUnique({
      where: { productId },
    });

    if (!inventory) {
      logger.warn(`No inventory found for product ${productId}`);
      return;
    }

    const newQuantity =
      type === "OUT" ? inventory.quantity - quantity : inventory.quantity + quantity;

    await prisma.inventoryItem.update({
      where: { productId },
      data: { quantity: newQuantity },
    });

    // Record movement
    await prisma.stockMovement.create({
      data: {
        inventoryId: inventory.id,
        type: type === "OUT" ? "OUT" : "IN",
        quantity,
        reason: type === "OUT" ? "Order fulfillment" : "Order cancellation",
      },
    });

    // Check for low stock alert
    if (newQuantity < inventory.minQuantity) {
      const existingAlert = await prisma.stockAlert.findFirst({
        where: {
          productId,
          resolved: false,
        },
      });

      if (!existingAlert) {
        await prisma.stockAlert.create({
          data: {
            inventoryId: inventory.id,
            productId,
            alertType: "LOW_STOCK",
            quantity: newQuantity,
          },
        });

        logger.warn(`Low stock alert for product ${productId}`);
      }
    }
  }
}

export default new OrderService();
