import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePettyCashDto {
  @IsNumber()
  assignedAmount!: number;

  @IsNotEmpty()
  contractId!: number;

  @IsNotEmpty()
  responsibleId!: number;
}