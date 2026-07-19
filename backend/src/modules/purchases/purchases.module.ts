import { Module } from '@nestjs/common';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { PurchaseInvoicesRepository } from '@/laudus-sdk/repositories/purchase-invoices.repository';

@Module({
  controllers: [PurchasesController],
  providers: [PurchasesService, PurchaseInvoicesRepository],
})
export class PurchasesModule {}