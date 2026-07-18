export interface SalesInvoiceModel {
  salesInvoiceId: number;
  number: string;
  issuedDate: string;
  total: number;
  // Aquí luego añadiremos: customer, items, etc. según el Swagger
}