import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { SalesInvoicesRepository } from '@/laudus-sdk/repositories/sales-invoices.repository';

@Module({
  controllers: [SalesController],
  providers: [SalesService, SalesInvoicesRepository],
})
export class SalesModule {}