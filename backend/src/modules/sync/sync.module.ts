import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { CustomersRepository } from '@/laudus-sdk/repositories/customers.repository';

@Module({
  controllers: [SyncController],
  providers: [SyncService, CustomersRepository],
})
export class SyncModule {}