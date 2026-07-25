import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

enum TaskType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
  WORK = 'WORK',
  OTHER = 'OTHER'
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(TaskType)
  type!: TaskType;

  @IsNumber()
  @Type(() => Number)
  unitPrice!: number;

  @IsInt()
  contractId!: number;
}