import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

enum MovementType {
  OUT_TO_SITE = 'OUT_TO_SITE',
  CONSUMED = 'CONSUMED',
  RETURNED = 'RETURNED',
}

export class CreateStockMovementDto {
  @IsInt()
  productId!: number;

  @IsInt()
  contractId!: number;

  @IsEnum(MovementType)
  type!: MovementType;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity!: number;

  @IsOptional()
  @IsString()
  description?: string;
}