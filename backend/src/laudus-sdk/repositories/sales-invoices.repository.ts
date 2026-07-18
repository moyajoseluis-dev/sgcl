import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { LaudusClientService } from '../services/laudus-client.service';
import { SalesInvoiceModel } from '../models/sales-invoice.model';

@Injectable()
export class SalesInvoicesRepository extends BaseRepository<SalesInvoiceModel> {
  constructor(client: LaudusClientService) {
    super(client, '/sales/invoices');
  }

  public async downloadPdf(id: string): Promise<Buffer> {
    const response = await this.client.get<Buffer>(`${this.endpoint}/${id}/pdf`, {
      responseType: 'arraybuffer',
    });
    return response as unknown as Buffer;
  }
}