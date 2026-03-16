import { IsDecimal, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateEntregaDto {
  @IsUUID()
  clienteId: string;

  @IsOptional()
  @IsUUID()
  motoboyId?: string;

  @IsDecimal()
  latitude: number;

  @IsDecimal()
  longitude: number;

  @IsString()
  @IsNotEmpty()
  endereco: string;

  @IsOptional()
  @IsString()
  previsaoEntrega?: string;
}
