import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MotoboysService } from '../services/motoboys.service';

@ApiTags('motoboys')
@Controller()
export class MotoboysController {
  constructor(private readonly motoboysService: MotoboysService) {}

  @Get('motoboys')
  @ApiOperation({ summary: 'Listar motoboys ativos' })
  list() {
    return this.motoboysService.listAll();
  }
}
