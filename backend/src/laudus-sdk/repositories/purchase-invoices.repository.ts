import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { LaudusClientService } from '../services/laudus-client.service';

// Modelo mínimo para Facturas de Compra
export interface PurchaseInvoiceModel {
  purchaseInvoiceId: number;
  issuedDate: string;
  supplierName?: string;
  total?: number;
}

@Injectable()
export class PurchaseInvoicesRepository extends BaseRepository<PurchaseInvoiceModel> {
  constructor(client: LaudusClientService) {
    // Endpoint exacto según el Swagger de Laudus
    super(client, '/purchases/invoices');
  }
}