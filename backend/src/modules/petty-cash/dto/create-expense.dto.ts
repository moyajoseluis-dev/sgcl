import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsNumber()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  concept!: string;

  @IsOptional()
  @IsString()
  receiptUrl?: string;
}