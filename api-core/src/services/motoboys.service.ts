import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Motoboy } from '../entities/motoboy.entity';

@Injectable()
export class MotoboysService {
  constructor(@InjectRepository(Motoboy) private motoboyRepository: Repository<Motoboy>) {}

  listAll(): Promise<Motoboy[]> {
    return this.motoboyRepository.find();
  }
}
