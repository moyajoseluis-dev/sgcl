import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateBillingCycleDto {
  @IsInt()
  contractId!: number;

  @IsString()
  @IsNotEmpty()
  period!: string; // Ej: "Octubre 2026"
}