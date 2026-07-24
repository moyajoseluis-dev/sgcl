import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { CustomersRepository } from '@/laudus-sdk/repositories/customers.repository';
import { ProductsRepository } from '@/laudus-sdk/repositories/products.repository';

@Module({
  controllers: [SyncController],
  providers: [SyncService, CustomersRepository,ProductsRepository],
})
export class SyncModule {}