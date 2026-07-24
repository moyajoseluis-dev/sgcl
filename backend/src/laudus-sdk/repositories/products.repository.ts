import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { LaudusClientService } from '../services/laudus-client.service';

export interface ProductModel {
  productId: number;
  code: string;
  description: string;
  unit: string;
}

@Injectable()
export class ProductsRepository extends BaseRepository<ProductModel> {
  constructor(client: LaudusClientService) {
    super(client, '/production/products');
  }
}