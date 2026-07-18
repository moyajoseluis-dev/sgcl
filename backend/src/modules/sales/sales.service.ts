import { Injectable } from '@nestjs/common';
import { SalesInvoicesRepository } from '@/laudus-sdk/repositories/sales-invoices.repository';
import { PagedResponseDto } from '@/laudus-sdk/dto/paged-response.dto';
import { SalesInvoiceModel } from '@/laudus-sdk/models/sales-invoice.model';
import { ListSalesInvoicesDto } from './dto/list-sales-invoices.dto';

@Injectable()
export class SalesService {
  constructor(
    private readonly salesInvoicesRepository: SalesInvoicesRepository,
  ) {}

  public async findAll(
    dto: ListSalesInvoicesDto,
  ): Promise<PagedResponseDto<SalesInvoiceModel>> {
    return this.salesInvoicesRepository.list(dto);
  }

  public async findById(id: number): Promise<SalesInvoiceModel> {
    return this.salesInvoicesRepository.findById(id);
  }
}