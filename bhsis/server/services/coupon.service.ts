import prisma from "../config/database";
import { CouponType } from "../../prisma/generated/food";

export class CouponService {
  async createCoupon(data: {
    code: string;
    description?: string;
    type: CouponType;
    value: number;
    minOrder?: number;
    maxDiscount?: number;
    maxUses?: number;
    startsAt?: Date;
    endsAt?: Date;
  }) {
    return prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description,
        type: data.type,
        value: data.value,
        minOrder: data.minOrder ?? 0,
        maxDiscount: data.maxDiscount,
        maxUses: data.maxUses,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
      },
    });
  }

  async getCoupons(filters?: { active?: boolean; code?: string }) {
    return prisma.coupon.findMany({
      where: {
        ...(filters?.active !== undefined ? { active: filters.active } : {}),
        ...(filters?.code ? { code: filters.code.toUpperCase() } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getCouponById(id: string) {
    return prisma.coupon.findUnique({ where: { id } });
  }

  async updateCoupon(id: string, data: Partial<{
    code: string;
    description: string;
    type: CouponType;
    value: number;
    minOrder: number;
    maxDiscount: number;
    maxUses: number;
    startsAt: Date | null;
    endsAt: Date | null;
    active: boolean;
  }>) {
    return prisma.coupon.update({
      where: { id },
      data: {
        ...data,
        ...(data.code ? { code: data.code.toUpperCase() } : {}),
      },
    });
  }

  async deactivateCoupon(id: string) {
    return prisma.coupon.update({
      where: { id },
      data: { active: false },
    });
  }

  async validateCoupon(input: { code: string; subtotal: number }) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: input.code.toUpperCase() },
    });

    if (!coupon || !coupon.active) {
      throw new Error("Cupom inválido ou inativo");
    }

    const now = new Date();
    if (coupon.startsAt && now < coupon.startsAt) {
      throw new Error("Cupom ainda não está ativo");
    }
    if (coupon.endsAt && now > coupon.endsAt) {
      throw new Error("Cupom expirado");
    }
    if (coupon.maxUses !== null && coupon.maxUses !== undefined && coupon.usesCount >= coupon.maxUses) {
      throw new Error("Cupom esgotado");
    }
    if (input.subtotal < coupon.minOrder) {
      throw new Error("Pedido abaixo do valor mínimo para o cupom");
    }

    let discount = 0;
    if (coupon.type === CouponType.PERCENT) {
      discount = (input.subtotal * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }

    if (discount > input.subtotal) {
      discount = input.subtotal;
    }

    return { coupon, discount };
  }

  async registerRedemption(input: {
    couponId: string;
    orderId: string;
    customerId: string;
    discountAmount: number;
  }) {
    await prisma.$transaction([
      prisma.coupon.update({
        where: { id: input.couponId },
        data: { usesCount: { increment: 1 } },
      }),
      prisma.couponRedemption.create({
        data: {
          couponId: input.couponId,
          orderId: input.orderId,
          customerId: input.customerId,
          discountAmount: input.discountAmount,
        },
      }),
    ]);
  }
}

export default new CouponService();
