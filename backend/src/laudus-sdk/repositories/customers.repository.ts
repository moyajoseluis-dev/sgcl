import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { LaudusClientService } from '../services/laudus-client.service';

export interface CustomerModel {
  customerId: number;
  name: string;
  vatId?: string;
  email?: string;
  phone1?: string; // <--- Cambiado a phone1
}

@Injectable()
export class CustomersRepository extends BaseRepository<CustomerModel> {
  constructor(client: LaudusClientService) {
    super(client, '/sales/customers');
  }
}