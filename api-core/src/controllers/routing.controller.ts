import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OptimizeRouteDto } from '../dto/optimize-route.dto';
import { RoutingService } from '../services/routing.service';

@ApiTags('rotas')
@Controller()
export class RoutingController {
  constructor(private readonly routingService: RoutingService) {}

  @Post('rotas/otimizar')
  @ApiOperation({ summary: 'Enviar entregas para otimizar ordem via Graphhopper VRP' })
  optimize(@Body() payload: OptimizeRouteDto) {
    return this.routingService.optimizeRoute(payload);
  }
}
