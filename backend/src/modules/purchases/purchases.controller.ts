import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PurchasesService } from './purchases.service';
import { ListPurchaseInvoicesDto } from './dto/list-purchase-invoices.dto';

@ApiTags('Purchases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'purchases',
  version: '1',
})
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post('invoices/list')
  public async listInvoices(@Body() dto: ListPurchaseInvoicesDto) {
    return this.purchasesService.findAll(dto);
  }
}