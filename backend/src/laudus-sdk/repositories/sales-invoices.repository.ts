import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { LaudusClientService } from '../services/laudus-client.service';
import { SalesInvoiceModel } from '../models/sales-invoice.model';

@Injectable()
export class SalesInvoicesRepository extends BaseRepository<SalesInvoiceModel> {
  constructor(client: LaudusClientService) {
    // El endpoint base según el Swagger de Laudus
    super(client, '/sales/invoices');
  }
}