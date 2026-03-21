import { Router, Response } from "express";
import { z } from "zod";
import paymentService from "../services/payment.service";
import { authMiddleware, AuthRequest, requireRole } from "../middleware/auth.middleware";
import { UserRole } from "../config/authDatabase";

const router = Router();
const webhookRouter = Router();

const createSchema = z.object({
  orderId: z.string(),
});
const refundSchema = z.object({
  amount: z.number().positive().optional(),
});

router.post(
  "/checkout-session",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.ATTENDANT, UserRole.CUSTOMER),
  async (req: AuthRequest, res: Response) => {
    try {
      const { orderId } = createSchema.parse(req.body);
      const session = await paymentService.createCheckoutSession(orderId);
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ error: error?.message || "Falha ao criar sessão de pagamento" });
    }
  }
);

router.post(
  "/intent",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.ATTENDANT, UserRole.CUSTOMER),
  async (req: AuthRequest, res: Response) => {
    try {
      const { orderId } = createSchema.parse(req.body);
      const intent = await paymentService.createPaymentIntent(orderId);
      res.json(intent);
    } catch (error: any) {
      res.status(400).json({ error: error?.message || "Falha ao criar payment intent" });
    }
  }
);

router.get(
  "/",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const status = req.query.status as any;
      const payments = await paymentService.listPayments({
        from: req.query.from as string | undefined,
        to: req.query.to as string | undefined,
        status,
      });
      res.json(payments);
    } catch (error: any) {
      res.status(400).json({ error: error?.message || "Falha ao listar pagamentos" });
    }
  }
);

router.get(
  "/orders/:orderId",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.ATTENDANT),
  async (req: AuthRequest, res: Response) => {
    try {
      const payments = await paymentService.listPaymentsByOrder(req.params.orderId);
      res.json(payments);
    } catch (error: any) {
      res.status(400).json({ error: error?.message || "Falha ao listar pagamentos" });
    }
  }
);

router.post(
  "/:paymentId/refund",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const { amount } = refundSchema.parse(req.body ?? {});
      const refund = await paymentService.createRefund(req.params.paymentId, amount);
      res.json(refund);
    } catch (error: any) {
      res.status(400).json({ error: error?.message || "Falha ao realizar reembolso" });
    }
  }
);

router.get(
  "/report",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.MANAGER),
  async (req: AuthRequest, res: Response) => {
    try {
      const report = await paymentService.getRevenueReport({
        from: req.query.from as string | undefined,
        to: req.query.to as string | undefined,
      });
      res.json(report);
    } catch (error: any) {
      res.status(400).json({ error: error?.message || "Falha ao gerar relatório" });
    }
  }
);

webhookRouter.post("/", async (req, res) => {
  try {
    const signature = req.headers["stripe-signature"] as string | undefined;
    const payload = req.body as Buffer;
    const result = await paymentService.handleWebhook(payload, signature);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error?.message || "Falha ao processar webhook" });
  }
});

export { router as paymentsRoutes, webhookRouter as paymentsWebhookRoutes };
