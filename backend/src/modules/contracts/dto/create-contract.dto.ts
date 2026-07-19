import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

enum ContractStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export class CreateContractDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @IsNotEmpty()
  startDate!: Date;

  @IsNotEmpty()
  endDate!: Date;

  @IsNumber()
  @Type(() => Number)
  amount!: number;

  @IsString()
  @IsNotEmpty()
  entityName!: string;
}