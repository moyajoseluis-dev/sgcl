import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
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

  // Cambiamos a string para permitir "E00003932"
  @Get('invoices/:id')
  public async getInvoice(@Param('id') id: string) {
    return this.salesService.findById(id);
  }

  // Cambiamos a string aquí también
  @Get('invoices/:id/pdf')
  public async downloadPdf(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.salesService.downloadPdf(id);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="factura-${id}.pdf"`,
    });
    
    res.send(pdfBuffer);
  }
}