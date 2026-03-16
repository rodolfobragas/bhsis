import { IsArray, IsDecimal, IsOptional, IsUUID } from 'class-validator';

export class OptimizeRouteDto {
  @IsUUID()
  motoboyId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  entregaIds: string[];

  @IsOptional()
  @IsDecimal()
  startLatitude?: number;

  @IsOptional()
  @IsDecimal()
  startLongitude?: number;
}
