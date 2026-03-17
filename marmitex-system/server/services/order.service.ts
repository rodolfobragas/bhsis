import prisma from "../config/database";
import { OrderStatus } from "@prisma/client";
import logger from "../config/logger";
import { getSocketServer } from "../websocket/socket";
import couponService from "./coupon.service";
import loyaltyService from "./loyalty.service";
import tableService from "./table.service";

export interface CreateOrderDTO {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  notes?: string;
  couponCode?: string;
  loyaltyPointsToRedeem?: number;
  tableId?: string;
}

export class OrderService {
  private parseIngredients(ingredients?: string) {
    if (!ingredients) return [];
    return ingredients
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^(.*?)(?:\s*[-:]\s*)([\d.,]+)\s*(\S+)?$/);
        if (!match) {
          return { name: line, quantity: 0, unit: "" };
        }
        const [, name, qtyRaw, unit = ""] = match;
        const quantity = Number(qtyRaw.replace(",", "."));
        return { name: name.trim(), quantity: Number.isNaN(quantity) ? 0 : quantity, unit };
      });
  }

  private buildIngredientsSummary(order: any) {
    const summary = new Map<string, { name: string; quantity: number; unit: string }>();

    for (const item of order.items ?? []) {
      const recipe = item.product?.recipe;
      const parsed = this.parseIngredients(recipe?.ingredients);
      parsed.forEach((ingredient) => {
        const key = `${ingredient.name}|${ingredient.unit}`;
        const current = summary.get(key) ?? {
          name: ingredient.name,
          quantity: 0,
          unit: ingredient.unit,
        };
        current.quantity += ingredient.quantity * item.quantity;
        summary.set(key, current);
      });
    }

    return Array.from(summary.values());
  }

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

      let couponDiscount = 0;
      let couponId: string | undefined;
      if (data.couponCode) {
        const couponResult = await couponService.validateCoupon({
          code: data.couponCode,
          subtotal,
        });
        couponDiscount = couponResult.discount;
        couponId = couponResult.coupon.id;
      }

      let loyaltyPointsRedeemed = 0;
      let loyaltyAccountId: string | null = null;
      if (data.loyaltyPointsToRedeem && data.loyaltyPointsToRedeem > 0) {
        const account = await loyaltyService.getOrCreateAccount(data.customerId);
        loyaltyAccountId = account.id;
        if (account.pointsBalance < data.loyaltyPointsToRedeem) {
          throw new Error("Saldo de pontos insuficiente");
        }
        loyaltyPointsRedeemed = data.loyaltyPointsToRedeem;
      }

      const discountTotal = couponDiscount + loyaltyPointsRedeemed;
      const taxableSubtotal = Math.max(0, subtotal - discountTotal);
      const tax = taxableSubtotal * 0.1; // 10% tax
      const total = taxableSubtotal + tax;

      // Create order with items
      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerId: data.customerId,
          status: OrderStatus.PENDING,
          subtotal,
          tax,
          total,
          discount: discountTotal,
          couponId,
          loyaltyPointsRedeemed,
          tableId: data.tableId,
          notes: data.notes,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  recipe: true,
                },
              },
            },
          },
          customer: true,
        },
      });

      const io = getSocketServer();
      if (io) {
        const payload = {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          items: order.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.unitPrice,
          })),
          total: order.total,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        };
        io.to("role:KITCHEN").emit("order:new", payload);
        io.to("role:ADMIN").emit("order:new", payload);
      }

      if (data.tableId) {
        await tableService.assignOrderToTable(data.tableId, order.id);
      }

      if (couponId) {
        await couponService.registerRedemption({
          couponId,
          orderId: order.id,
          customerId: data.customerId,
          discountAmount: couponDiscount,
        });
      }

      if (loyaltyAccountId && loyaltyPointsRedeemed > 0) {
        await loyaltyService.redeemPoints({
          accountId: loyaltyAccountId,
          orderId: order.id,
          points: loyaltyPointsRedeemed,
          notes: "Resgate no pedido",
        });
      }

      // Update inventory
      for (const item of data.items) {
        await this.updateInventory(item.productId, item.quantity, "OUT");
      }

      logger.info(`Order created: ${orderNumber}`);
      return {
        ...order,
        ingredientsSummary: this.buildIngredientsSummary(order),
      };
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
            product: {
              include: {
                recipe: true,
              },
            },
          },
        },
        customer: true,
        coupon: true,
        table: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }).then((orders) =>
      orders.map((order) => ({
        ...order,
        ingredientsSummary: this.buildIngredientsSummary(order),
      }))
    );
  }

  async getOrderById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                recipe: true,
              },
            },
          },
        },
        customer: true,
        coupon: true,
        table: true,
        payments: true,
      },
    }).then((order) => {
      if (!order) return order;
      return {
        ...order,
        ingredientsSummary: this.buildIngredientsSummary(order),
      };
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
            product: {
              include: {
                recipe: true,
              },
            },
          },
        },
      },
    });

    const io = getSocketServer();
    if (io) {
      const payload = {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        items: order.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.unitPrice,
        })),
        total: order.total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
      io.to("role:KITCHEN").emit("order:updated", payload);
      io.to("role:ADMIN").emit("order:updated", payload);
      if (status === OrderStatus.DELIVERED) {
        io.emit("order:completed", payload);
      }
    }

    if (status === OrderStatus.DELIVERED) {
      const pointsToEarn = Math.max(0, Math.floor(order.total));
      if (pointsToEarn > 0) {
        const account = await loyaltyService.getOrCreateAccount(order.customerId);
        await loyaltyService.addPoints({
          accountId: account.id,
          orderId: order.id,
          points: pointsToEarn,
          notes: "Pontos por pedido entregue",
        });
        await prisma.order.update({
          where: { id: order.id },
          data: { loyaltyPointsEarned: pointsToEarn },
        });
      }
      if (order.tableId) {
        await tableService.releaseTable(order.tableId);
      }
    }

    if (status === OrderStatus.CANCELLED && order.tableId) {
      await tableService.releaseTable(order.tableId);
    }

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
