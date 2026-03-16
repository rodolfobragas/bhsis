import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  async notifyClientNextDelivery(motoboyId: string) {
    this.logger.log(`Notificar cliente da proxima entrega do motoboy ${motoboyId}`);
    // Integracoes futuras: WhatsApp API, SMS e Push Notification
  }
}
