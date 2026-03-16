import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeliveriesService } from '../services/deliveries.service';

@ApiTags('dashboard')
@Controller()
export class DashboardController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get('dashboard/resumo')
  @ApiOperation({ summary: 'Resumo rapido do dashboard (entregas, media, status)' })
  resumo() {
    return this.deliveriesService.getDashboardSummary();
  }
}
