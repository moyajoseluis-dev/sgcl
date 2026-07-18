import { IsIn, IsString } from 'class-validator';

export class OrderByDto {
  @IsString()
  field!: string;

  @IsString()
  @IsIn(['ASC', 'DESC'])
  direction!: 'ASC' | 'DESC';
}