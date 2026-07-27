import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { LaudusClientService } from '../services/laudus-client.service';

export interface EmployeeModel {
  employeeId: number;
  firstName: string;
  lastName: string;
  salary: number;
  costCenter: { costCenterId: string };
}

@Injectable()
export class EmployeesRepository extends BaseRepository<EmployeeModel> {
  constructor(client: LaudusClientService) {
    super(client, '/HR/employees');
  }
}