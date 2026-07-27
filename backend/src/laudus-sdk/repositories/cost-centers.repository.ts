import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { LaudusClientService } from '../services/laudus-client.service';

export interface CostCenterModel {
  costCenterId: string;
  name: string;
}

@Injectable()
export class CostCentersRepository extends BaseRepository<CostCenterModel> {
  constructor(client: LaudusClientService) {
    super(client, '/purchases/costcenters');
  }
}