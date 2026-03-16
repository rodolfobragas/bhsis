import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Motoboy } from '../entities/motoboy.entity';
import { MotoboysController } from '../controllers/motoboys.controller';
import { MotoboysService } from '../services/motoboys.service';

@Module({
  imports: [TypeOrmModule.forFeature([Motoboy])],
  controllers: [MotoboysController],
  providers: [MotoboysService],
})
export class MotoboysModule {}
