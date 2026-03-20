import { DeliveryStatus, OrderStatus, Prisma } from "@prisma/client";
import prisma from "../config/database";
import logger from "../config/logger";
import { getSocketServer } from "../websocket/socket";
import notificationsQueue from "../queues/notification.queue";

export interface CreateDeliveryDTO {
  orderId: string;
  latitude: number;
  longitude: number;
  endereco: string;
  motoboyId?: string;
  previsaoEntrega?: string;
}

export interface DeliveryPositionDTO {
  latitude: number;
  longitude: number;
  speed?: number;
  timestamp?: string;
  motoboyId?: string;
  status?: DeliveryStatus;
}

class DeliveryService {
  async list(filter?: { motoboyId?: string; status?: DeliveryStatus }) {
    return prisma.delivery.findMany({
      include: {
        motoboy: true,
        customer: true,
        order: true,
      },
      where: {
        ...(filter?.motoboyId && { motoboyId: filter.motoboyId }),
        ...(filter?.status && { status: filter.status }),
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: string) {
    return prisma.delivery.findUnique({
      where: { id },
      include: { motoboy: true, customer: true, order: true },
    });
  }

  async create(data: CreateDeliveryDTO) {
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
      include: { customer: true },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    const delivery = await prisma.delivery.create({
      data: {
        orderId: order.id,
        customerId: order.customerId,
        motoboyId: data.motoboyId,
        latitude: data.latitude,
        longitude: data.longitude,
        endereco: data.endereco,
        previsaoEntrega: data.previsaoEntrega
          ? new Date(data.previsaoEntrega)
          : undefined,
        status: DeliveryStatus.PENDENTE,
      },
      include: { motoboy: true, customer: true, order: true },
    });

    this.emit("delivery:new", delivery);
    await this.createEvento(delivery.id, "create", { orderId: order.id });

    return delivery;
  }

  async updateStatus(id: string, status: DeliveryStatus) {
    const delivery = await prisma.delivery.update({
      where: { id },
      data: { status },
      include: { motoboy: true, order: true, customer: true },
    });

    await this.createEvento(id, "status", { status });
    this.emit("delivery:updated", delivery);

    if (status === DeliveryStatus.ENTREGUE && delivery.orderId) {
      await prisma.order.update({
        where: { id: delivery.orderId },
        data: {
          status: OrderStatus.DELIVERED,
          completedAt: new Date(),
        },
      });
    }

    try {
      await notificationsQueue.add("status.atualizado", {
        entregaId: id,
        motoboyId: delivery.motoboyId,
        status,
        phone: delivery.customer?.phone,
        deviceId: delivery.motoboy?.deviceIdTraccar,
      });
    } catch (error) {
      logger.warn("Falha ao enfileirar status.atualizado", error);
    }

    return delivery;
  }

  async recordPosition(deliveryId: string, payload: DeliveryPositionDTO) {
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
      include: { motoboy: true },
    });

    if (!delivery) {
      throw new Error("Entrega não encontrada");
    }

    const motoboyId = delivery.motoboyId ?? payload.motoboyId;
    if (!motoboyId) {
      throw new Error("Motoboy não associado");
    }

    await prisma.posicaoMotoboy.create({
      data: {
        motoboyId,
        latitude: payload.latitude,
        longitude: payload.longitude,
        speed: payload.speed,
        timestamp: payload.timestamp ? new Date(payload.timestamp) : undefined,
      },
    });

    if (payload.status) {
      await this.updateStatus(deliveryId, payload.status);
    }

    const emitterPayload = {
      motoboyId,
      deliveryId,
      latitude: payload.latitude,
      longitude: payload.longitude,
      speed: payload.speed,
      timestamp: payload.timestamp,
    };

    this.emit("delivery:position", emitterPayload);

    return emitterPayload;
  }

  private async createEvento(id: string, tipo: string, detalhes?: Prisma.InputJsonValue) {
    await prisma.eventoEntrega.create({
      data: {
        entregaId: id,
        tipo,
        detalhes: detalhes ?? undefined,
      },
    });
  }

  private emit(event: string, payload: unknown) {
    const io = getSocketServer();
    if (io) {
      io.emit(event, payload);
    }
  }
}

export default new DeliveryService();
