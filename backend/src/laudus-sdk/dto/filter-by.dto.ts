import { IsDefined, IsString } from 'class-validator';

export class FilterByDto {
  @IsString()
  field!: string;

  @IsString()
  operator!: string;

  @IsDefined() // <--- Agregamos esto para que NestJS permita recibir la propiedad "value"
  value!: string | number | boolean | string[];
}