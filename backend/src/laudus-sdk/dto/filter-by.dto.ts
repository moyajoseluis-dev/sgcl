export interface FilterByDto {
  field: string;
  operator: string; // Ej: "=", ">", "<", "contains", "in"
  value: string | number | boolean | string[];
}