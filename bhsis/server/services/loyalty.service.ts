import prisma from "../config/database";
import { LoyaltyTier, LoyaltyTransactionType } from "../../prisma/generated/food";
import { getSocketServer } from "../websocket/socket";

const tierConfig: Array<{ tier: LoyaltyTier; minEarned: number; benefits: string[] }> = [
  {
    tier: LoyaltyTier.BRONZE,
    minEarned: 0,
    benefits: ["Pontos base por compra"],
  },
  {
    tier: LoyaltyTier.SILVER,
    minEarned: 500,
    benefits: ["Bônus de 5% em pontos", "Acesso antecipado a cupons"],
  },
  {
    tier: LoyaltyTier.GOLD,
    minEarned: 1500,
    benefits: ["Bônus de 10% em pontos", "Atendimento prioritário", "Benefícios especiais"],
  },
];

const resolveTier = (totalEarned: number) => {
  return tierConfig
    .slice()
    .reverse()
    .find((tier) => totalEarned >= tier.minEarned)?.tier ?? LoyaltyTier.BRONZE;
};

export class LoyaltyService {
  async getTiers() {
    return tierConfig.map((tier) => ({
      tier: tier.tier,
      minEarned: tier.minEarned,
      benefits: tier.benefits,
    }));
  }

  async getOrCreateAccount(customerId: string) {
    const existing = await prisma.loyaltyAccount.findUnique({
      where: { customerId },
    });
    if (existing) return existing;
    return prisma.loyaltyAccount.create({
      data: { customerId, tier: LoyaltyTier.BRONZE },
    });
  }

  async getAccount(customerId: string) {
    return prisma.loyaltyAccount.findUnique({
      where: { customerId },
      include: { customer: true },
    });
  }

  async listTransactions(customerId: string) {
    const account = await this.getOrCreateAccount(customerId);
    return prisma.loyaltyTransaction.findMany({
      where: { accountId: account.id },
      orderBy: { createdAt: "desc" },
    });
  }

  async getTierBenefits(tier: LoyaltyTier) {
    const config = tierConfig.find((item) => item.tier === tier);
    return config?.benefits ?? [];
  }

  private async updateTierIfNeeded(accountId: string) {
    const account = await prisma.loyaltyAccount.findUnique({
      where: { id: accountId },
    });
    if (!account) return null;
    const nextTier = resolveTier(account.totalEarned);
    if (account.tier === nextTier) return account;
    return prisma.loyaltyAccount.update({
      where: { id: accountId },
      data: { tier: nextTier },
    });
  }

  private notifyPoints(accountId: string, payload: { customerId?: string; delta: number; balance: number; tier: LoyaltyTier }) {
    const io = getSocketServer();
    if (!io) return;
    io.to("role:ADMIN").emit("loyalty:points", {
      accountId,
      ...payload,
    });
  }

  async addPoints(input: { accountId: string; points: number; orderId?: string; notes?: string }) {
    if (input.points <= 0) return;
    const [, transaction] = await prisma.$transaction([
      prisma.loyaltyAccount.update({
        where: { id: input.accountId },
        data: {
          pointsBalance: { increment: input.points },
          totalEarned: { increment: input.points },
        },
      }),
      prisma.loyaltyTransaction.create({
        data: {
          accountId: input.accountId,
          orderId: input.orderId,
          type: LoyaltyTransactionType.EARN,
          points: input.points,
          notes: input.notes,
        },
      }),
    ]);
    const updated = await this.updateTierIfNeeded(input.accountId);
    if (updated) {
      this.notifyPoints(input.accountId, {
        customerId: updated.customerId,
        delta: input.points,
        balance: updated.pointsBalance,
        tier: updated.tier,
      });
    }
  }

  async redeemPoints(input: { accountId: string; points: number; orderId?: string; notes?: string }) {
    const account = await prisma.loyaltyAccount.findUnique({
      where: { id: input.accountId },
    });
    if (!account) {
      throw new Error("Conta de fidelidade não encontrada");
    }
    if (input.points <= 0) return 0;
    if (account.pointsBalance < input.points) {
      throw new Error("Saldo de pontos insuficiente");
    }

    await prisma.$transaction([
      prisma.loyaltyAccount.update({
        where: { id: input.accountId },
        data: {
          pointsBalance: { decrement: input.points },
          totalRedeemed: { increment: input.points },
        },
      }),
      prisma.loyaltyTransaction.create({
        data: {
          accountId: input.accountId,
          orderId: input.orderId,
          type: LoyaltyTransactionType.REDEEM,
          points: input.points,
          notes: input.notes,
        },
      }),
    ]);

    const updated = await this.updateTierIfNeeded(input.accountId);
    if (updated) {
      this.notifyPoints(input.accountId, {
        customerId: updated.customerId,
        delta: -input.points,
        balance: updated.pointsBalance,
        tier: updated.tier,
      });
    }

    return input.points;
  }

  async adjustPoints(input: {
    accountId: string;
    points: number;
    notes?: string;
  }) {
    if (input.points === 0) return;
    await prisma.$transaction([
      prisma.loyaltyAccount.update({
        where: { id: input.accountId },
        data: {
          pointsBalance: { increment: input.points },
          ...(input.points > 0
            ? { totalEarned: { increment: input.points } }
            : { totalRedeemed: { increment: Math.abs(input.points) } }),
        },
      }),
      prisma.loyaltyTransaction.create({
        data: {
          accountId: input.accountId,
          type: LoyaltyTransactionType.ADJUST,
          points: input.points,
          notes: input.notes ?? "Ajuste manual",
        },
      }),
    ]);

    const updated = await this.updateTierIfNeeded(input.accountId);
    if (updated) {
      this.notifyPoints(input.accountId, {
        customerId: updated.customerId,
        delta: input.points,
        balance: updated.pointsBalance,
        tier: updated.tier,
      });
    }
  }
}

export default new LoyaltyService();
