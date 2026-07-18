import { IsArray, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterByDto } from '@/laudus-sdk/dto/filter-by.dto';
import { OrderByDto } from '@/laudus-sdk/dto/order-by.dto';

export class ListSalesInvoicesDto {
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset: number = 0;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsArray()
  fields?: string[];

  @IsOptional()
  @IsArray()
  filterBy?: FilterByDto[];

  @IsOptional()
  @IsArray()
  orderBy?: OrderByDto[];
}