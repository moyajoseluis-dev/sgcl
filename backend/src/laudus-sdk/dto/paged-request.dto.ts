import { FieldSelectorDto } from './field-selector.dto';
import { FilterByDto } from './filter-by.dto';
import { OrderByDto } from './order-by.dto';

export interface PagedRequestDto {
  page: number;
  pageSize: number;
  fields?: FieldSelectorDto[];
  filterBy?: FilterByDto[];
  orderBy?: OrderByDto[];
}