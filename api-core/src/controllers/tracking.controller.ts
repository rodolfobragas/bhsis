import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MotoboyLocationDto } from '../dto/motoboy-location.dto';
import { TraccarTrackingDto } from '../dto/traccar-tracking.dto';
import { TrackingService } from '../services/tracking.service';

@ApiTags('tracking')
@Controller()
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post('motoboy/localizacao')
  @ApiOperation({ summary: 'Atualizacao de localizacao enviada pelo app do motoboy' })
  updateFromMotoboy(@Body() payload: MotoboyLocationDto) {
    return this.trackingService.updateFromMotoboy(payload);
  }

  @Post('tracking/update')
  @ApiOperation({ summary: 'Webhook Traccar para salvar posicoes em tempo real' })
  updateFromTraccar(@Body() payload: TraccarTrackingDto) {
    return this.trackingService.updateFromTraccar(payload);
  }
}
