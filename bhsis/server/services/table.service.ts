import prisma from "../config/database";
import { TableStatus } from "@prisma/client";

export class TableService {
  async createTable(data: { name: string; capacity?: number; status?: TableStatus; location?: string }) {
    return prisma.diningTable.create({
      data: {
        name: data.name,
        capacity: data.capacity ?? 2,
        status: data.status ?? TableStatus.AVAILABLE,
        location: data.location,
      },
    });
  }

  async getTables(filters?: { status?: TableStatus; active?: boolean }) {
    return prisma.diningTable.findMany({
      where: {
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.active !== undefined ? { active: filters.active } : {}),
      },
      orderBy: { name: "asc" },
    });
  }

  async getTableById(id: string) {
    return prisma.diningTable.findUnique({ where: { id } });
  }

  async updateTable(
    id: string,
    data: Partial<{
      name: string;
      capacity: number;
      status: TableStatus;
      location: string | null;
      active: boolean;
    }>
  ) {
    return prisma.diningTable.update({
      where: { id },
      data,
    });
  }

  async deactivateTable(id: string) {
    return prisma.diningTable.update({
      where: { id },
      data: { active: false, status: TableStatus.OUT_OF_SERVICE },
    });
  }

  async assignOrderToTable(tableId: string, orderId: string) {
    const table = await prisma.diningTable.findUnique({ where: { id: tableId } });
    if (!table) {
      throw new Error("Mesa não encontrada");
    }

    const shouldStart = table.status !== TableStatus.OCCUPIED || !table.occupiedSince;
    return prisma.diningTable.update({
      where: { id: tableId },
      data: {
        currentOrderId: orderId,
        status: TableStatus.OCCUPIED,
        ...(shouldStart
          ? {
              occupiedSince: new Date(),
              turnovers: { increment: 1 },
            }
          : {}),
      },
    });
  }

  async releaseTable(tableId: string) {
    const table = await prisma.diningTable.findUnique({ where: { id: tableId } });
    if (!table) {
      throw new Error("Mesa não encontrada");
    }

    let occupiedMinutes = 0;
    if (table.occupiedSince) {
      const diffMs = Date.now() - table.occupiedSince.getTime();
      occupiedMinutes = Math.max(0, Math.round(diffMs / 60000));
    }

    return prisma.diningTable.update({
      where: { id: tableId },
      data: {
        currentOrderId: null,
        status: TableStatus.AVAILABLE,
        occupiedSince: null,
        ...(occupiedMinutes > 0
          ? { totalOccupiedMinutes: { increment: occupiedMinutes } }
          : {}),
      },
    });
  }
}

export default new TableService();
