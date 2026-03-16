import { IsDecimal, IsNumber, IsString } from 'class-validator';

export class TraccarTrackingDto {
  @IsString()
  deviceId: string;

  @IsDecimal()
  latitude: number;

  @IsDecimal()
  longitude: number;

  @IsNumber()
  speed: number;

  @IsString()
  timestamp: string;
}
