import { Router, Response } from "express";
import { z } from "zod";
import customerService from "../services/customer.service";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import logger from "../config/logger";

const router = Router();

const createCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(1),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
});

// Create customer
router.post(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const data = createCustomerSchema.parse(req.body);
      const customer = await customerService.createCustomer(data);
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Error creating customer:", error);
      res.status(400).json({ error: "Failed to create customer" });
    }
  }
);

// Get all customers
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 50;

    const customers = await customerService.getCustomers({
      skip,
      take,
    });

    res.json(customers);
  } catch (error) {
    logger.error("Error fetching customers:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// Get customer by ID
router.get(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      logger.error("Error fetching customer:", error);
      res.status(500).json({ error: "Failed to fetch customer" });
    }
  }
);

// Update customer
router.put(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const data = createCustomerSchema.partial().parse(req.body);
      const customer = await customerService.updateCustomer(req.params.id, data);
      res.json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      logger.error("Error updating customer:", error);
      res.status(400).json({ error: "Failed to update customer" });
    }
  }
);

// Delete customer (soft delete)
router.delete(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const customer = await customerService.deleteCustomer(req.params.id);
      res.json(customer);
    } catch (error) {
      logger.error("Error deleting customer:", error);
      res.status(400).json({ error: "Failed to delete customer" });
    }
  }
);

export default router;
