import prisma from "../config/database";

export interface CreateCustomerDTO {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
}

export class CustomerService {
  async createCustomer(data: CreateCustomerDTO) {
    return prisma.customer.create({
      data,
    });
  }

  async getCustomers(filters?: {
    active?: boolean;
    skip?: number;
    take?: number;
  }) {
    const { active = true, skip = 0, take = 50 } = filters || {};

    return prisma.customer.findMany({
      where: {
        ...(active !== undefined && { active }),
      },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      skip,
      take,
    });
  }

  async getCustomerById(id: string) {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async updateCustomer(id: string, data: Partial<CreateCustomerDTO>) {
    return prisma.customer.update({
      where: { id },
      data,
    });
  }

  async deleteCustomer(id: string) {
    return prisma.customer.update({
      where: { id },
      data: { active: false },
    });
  }
}

export default new CustomerService();
