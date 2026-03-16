import { IsDecimal, IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { DeliveryStatus } from '../common/enums/delivery-status.enum';

export class MotoboyLocationDto {
  @IsUUID()
  motoboyId: string;

  @IsDecimal()
  latitude: number;

  @IsDecimal()
  longitude: number;

  @IsOptional()
  @IsNumber()
  speed?: number;

  @IsOptional()
  timestamp?: string;

  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;
}
