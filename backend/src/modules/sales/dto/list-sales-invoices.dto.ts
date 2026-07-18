import { IsArray, IsInt, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FilterByDto } from '@/laudus-sdk/dto/filter-by.dto';
import { OrderByDto } from '@/laudus-sdk/dto/order-by.dto';

export class ListSalesInvoicesDto {
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsInt()
  @Min(1)
  pageSize: number = 50;

  @IsOptional()
  @IsArray()
  fields?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterByDto) // Esto asegura que los objetos se transformen correctamente
  filterBy?: FilterByDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderByDto)
  orderBy?: OrderByDto[];
}