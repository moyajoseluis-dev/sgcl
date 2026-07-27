import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { CustomersRepository } from '@/laudus-sdk/repositories/customers.repository';
import { ProductsRepository } from '@/laudus-sdk/repositories/products.repository';
import { CostCentersRepository } from '@/laudus-sdk/repositories/cost-centers.repository'; // <--- Nuevo
import { EmployeesRepository } from '@/laudus-sdk/repositories/employees.repository';       // <--- Nuevo

@Module({
  controllers: [SyncController],
  providers: [SyncService, CustomersRepository,ProductsRepository,CostCentersRepository, EmployeesRepository],
})
export class SyncModule {}