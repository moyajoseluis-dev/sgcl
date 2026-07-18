export interface PagedResponseDto<T> {
  page: number;
  pageSize: number;
  totalRows: number;
  rows: T[];
}