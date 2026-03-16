import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateEntregaDto } from '../dto/create-entrega.dto';
import { DeliveriesService } from '../services/deliveries.service';

@ApiTags('entregas')
@Controller()
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post('entregas')
  @ApiOperation({ summary: 'Registrar nova entrega' })
  create(@Body() payload: CreateEntregaDto) {
    return this.deliveriesService.create(payload);
  }

  @Get('entregas')
  @ApiOperation({ summary: 'Listar entregas' })
  findAll() {
    return this.deliveriesService.findAll();
  }

  @Get('entregas/:id')
  @ApiOperation({ summary: 'Buscar entrega pelo id' })
  findOne(@Param('id') id: string) {
    return this.deliveriesService.findOne(id);
  }
}
