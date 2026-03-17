import Stripe from "stripe";
import prisma from "../config/database";
import logger from "../config/logger";
import { OrderPaymentStatus, PaymentStatus } from "@prisma/client";

const STRIPE_API_VERSION: Stripe.StripeConfig["apiVersion"] = "2024-06-20";

class PaymentService {
  private stripe: Stripe | null = null;

  private getStripeClient() {
    if (this.stripe) return this.stripe;
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY não configurado");
    }
    this.stripe = new Stripe(secretKey, { apiVersion: STRIPE_API_VERSION });
    return this.stripe;
  }

  private getCurrency() {
    return (process.env.STRIPE_CURRENCY || "brl").toLowerCase();
  }

  private formatAmount(amount: number) {
    return Math.max(0, Math.round(amount * 100));
  }

  async createCheckoutSession(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    const amount = this.formatAmount(order.total);
    if (amount <= 0) {
      throw new Error("Valor do pedido inválido");
    }

    const stripe = this.getStripeClient();
    const successUrl =
      process.env.STRIPE_SUCCESS_URL || `${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/orders`;
    const cancelUrl =
      process.env.STRIPE_CANCEL_URL || `${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/orders`;

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "stripe",
        status: PaymentStatus.PENDING,
        amount,
        currency: this.getCurrency(),
        metadata: {
          orderNumber: order.orderNumber,
          customerName: order.customer?.name,
          customerEmail: order.customer?.email,
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: order.id,
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: order.customer?.email || undefined,
      metadata: {
        orderId: order.id,
        paymentId: payment.id,
      },
      line_items: [
        {
          price_data: {
            currency: this.getCurrency(),
            product_data: {
              name: `Pedido ${order.orderNumber}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: OrderPaymentStatus.PENDING,
        paymentMethod: "stripe",
      },
    });

    return {
      paymentId: payment.id,
      sessionId: session.id,
      url: session.url,
    };
  }

  async createPaymentIntent(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    const amount = this.formatAmount(order.total);
    if (amount <= 0) {
      throw new Error("Valor do pedido inválido");
    }

    const stripe = this.getStripeClient();

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: "stripe",
        status: PaymentStatus.PENDING,
        amount,
        currency: this.getCurrency(),
        metadata: {
          orderNumber: order.orderNumber,
          customerName: order.customer?.name,
          customerEmail: order.customer?.email,
        },
      },
    });

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: this.getCurrency(),
      metadata: {
        orderId: order.id,
        paymentId: payment.id,
      },
      receipt_email: order.customer?.email || undefined,
      automatic_payment_methods: { enabled: true },
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        stripePaymentIntentId: intent.id,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: OrderPaymentStatus.PENDING,
        paymentMethod: "stripe",
      },
    });

    return {
      paymentId: payment.id,
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
    };
  }

  async listPaymentsByOrder(orderId: string) {
    return prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
  }

  async listPayments(params?: { from?: string; to?: string; status?: PaymentStatus }) {
    const from = params?.from ? new Date(params.from) : undefined;
    const to = params?.to ? new Date(params.to) : undefined;
    return prisma.payment.findMany({
      where: {
        ...(params?.status ? { status: params.status } : {}),
        ...(from || to
          ? {
              createdAt: {
                ...(from ? { gte: from } : {}),
                ...(to ? { lte: to } : {}),
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async createRefund(paymentId: string, amount?: number) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });
    if (!payment) {
      throw new Error("Pagamento não encontrado");
    }
    if (!payment.stripePaymentIntentId) {
      throw new Error("Pagamento não possui PaymentIntent");
    }

    const stripe = this.getStripeClient();
    const refundAmount = amount ? this.formatAmount(amount) : undefined;

    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      ...(refundAmount ? { amount: refundAmount } : {}),
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.REFUNDED,
        metadata: {
          ...(payment.metadata as Record<string, unknown>),
          refundId: refund.id,
          refundAmount: refundAmount ?? payment.amount,
        },
      },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: OrderPaymentStatus.REFUNDED },
    });

    return {
      refundId: refund.id,
      status: refund.status,
      amount: refund.amount,
      currency: refund.currency,
    };
  }

  async getRevenueReport(params?: { from?: string; to?: string }) {
    const from = params?.from ? new Date(params.from) : undefined;
    const to = params?.to ? new Date(params.to) : undefined;

    const payments = await prisma.payment.findMany({
      where: {
        ...(from || to
          ? {
              createdAt: {
                ...(from ? { gte: from } : {}),
                ...(to ? { lte: to } : {}),
              },
            }
          : {}),
      },
    });

    let gross = 0;
    let refunded = 0;
    let succeededCount = 0;
    let refundedCount = 0;
    const currency = this.getCurrency();

    for (const payment of payments) {
      if (payment.status === PaymentStatus.SUCCEEDED) {
        gross += payment.amount;
        succeededCount += 1;
      }
      if (payment.status === PaymentStatus.REFUNDED) {
        const meta = payment.metadata as Record<string, any> | null;
        refunded += meta?.refundAmount ?? payment.amount;
        refundedCount += 1;
      }
    }

    const net = gross - refunded;

    return {
      currency,
      gross,
      refunded,
      net,
      succeededCount,
      refundedCount,
      from: from?.toISOString() ?? null,
      to: to?.toISOString() ?? null,
    };
  }

  async handleWebhook(payload: Buffer, signature: string | undefined) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error("STRIPE_WEBHOOK_SECRET não configurado");
    }

    const stripe = this.getStripeClient();
    const event = stripe.webhooks.constructEvent(payload, signature || "", secret);

    switch (event.type) {
      case "payment_intent.succeeded":
        await this.markPaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case "payment_intent.payment_failed":
        await this.markPaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case "checkout.session.completed":
        await this.markCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "charge.refunded":
        await this.markChargeRefunded(event.data.object as Stripe.Charge);
        break;
      default:
        logger.info(`Stripe webhook ignored: ${event.type}`);
        break;
    }

    return { received: true };
  }

  private async markPaymentIntentSucceeded(intent: Stripe.PaymentIntent) {
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntentId: intent.id },
    });
    if (!payment) return;

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.SUCCEEDED },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: OrderPaymentStatus.PAID },
    });
  }

  private async markPaymentIntentFailed(intent: Stripe.PaymentIntent) {
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntentId: intent.id },
    });
    if (!payment) return;

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.FAILED },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: OrderPaymentStatus.FAILED },
    });
  }

  private async markCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    if (!session.payment_intent) return;
    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent.id;
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntentId: paymentIntentId },
    });
    if (!payment) return;

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.SUCCEEDED,
        stripeCheckoutSessionId: session.id,
      },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: OrderPaymentStatus.PAID },
    });
  }

  private async markChargeRefunded(charge: Stripe.Charge) {
    const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
    if (!paymentIntentId) return;
    const payment = await prisma.payment.findFirst({
      where: { stripePaymentIntentId: paymentIntentId },
    });
    if (!payment) return;

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.REFUNDED },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: OrderPaymentStatus.REFUNDED },
    });
  }
}

const paymentService = new PaymentService();
export default paymentService;
