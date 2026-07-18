import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SalesService } from './sales.service';
import { ListSalesInvoicesDto } from './dto/list-sales-invoices.dto';

@ApiTags('Sales')
@ApiBearerAuth()
@Controller({
  path: 'sales',
  version: '1',
})
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('invoices/list')
  public async listInvoices(@Body() dto: ListSalesInvoicesDto) {
    return this.salesService.findAll(dto);
  }

  @Get('invoices/:id')
  public async getInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.salesService.findById(id);
  }
}