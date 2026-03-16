import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PosicaoMotoboy } from '../entities/posicao-motoboy.entity';
import { DeliverySnapshotDto } from '../dto/delivery-snapshot.dto';

@WebSocketGateway({ namespace: 'tracking', cors: { origin: '*' } })
export class TrackingGateway {
  @WebSocketServer()
  server: Server;

  broadcastPosition(position: PosicaoMotoboy, deliveries: DeliverySnapshotDto[]) {
    this.server?.emit('posicao-motoboy', {
      id: position.id,
      motoboyId: position.motoboy?.id,
      latitude: Number(position.latitude),
      longitude: Number(position.longitude),
      timestamp: position.timestamp,
      speed: position.speed,
      deliveries,
    });
  }
}
