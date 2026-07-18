import { Injectable } from '@nestjs/common';
import { SalesInvoicesRepository } from '@/laudus-sdk/repositories/sales-invoices.repository';
import { SalesInvoiceModel } from '@/laudus-sdk/models/sales-invoice.model';
import { FilterByDto } from '@/laudus-sdk/dto/filter-by.dto';
import { OrderByDto } from '@/laudus-sdk/dto/order-by.dto';
import { ListSalesInvoicesDto } from './dto/list-sales-invoices.dto';

@Injectable()
export class SalesService {
  constructor(
    private readonly salesInvoicesRepository: SalesInvoicesRepository,
  ) {}

  public async findAll(dto: ListSalesInvoicesDto) {
    const offset = Number(dto.offset) || 0;
    const limit = Number(dto.limit) || 10;

    // Tipamos explícitamente como FilterByDto[]
    let finalFilterBy: FilterByDto[] = [{ field: "issuedDate", operator: ">", value: "2023-01-01T00:00:00" }];
    if (dto.filterBy && Array.isArray(dto.filterBy) && dto.filterBy.length > 0) {
      const cleanFilters = dto.filterBy.filter(f => f && typeof f === 'object' && !Array.isArray(f) && f.field);
      if (cleanFilters.length > 0) {
        finalFilterBy = cleanFilters;
      }
    }

    // Tipamos explícitamente como OrderByDto[]
    let finalOrderBy: OrderByDto[] = [{ field: "issuedDate", direction: "DESC" }];
    if (dto.orderBy && Array.isArray(dto.orderBy) && dto.orderBy.length > 0) {
      const cleanOrder = dto.orderBy.filter(o => o && typeof o === 'object' && !Array.isArray(o) && o.field);
      if (cleanOrder.length > 0) {
        finalOrderBy = cleanOrder;
      }
    }

    const laudusPayload: Record<string, unknown> = {
      options: { offset, limit },
      fields: dto.fields && dto.fields.length > 0 ? dto.fields : ["salesInvoiceId", "issuedDate"],
      filterBy: finalFilterBy,
      orderBy: finalOrderBy
    };

    return this.salesInvoicesRepository.list(laudusPayload);
  }

  public async findById(id: string): Promise<SalesInvoiceModel> {
    return this.salesInvoicesRepository.findById(id);
  }

  public async downloadPdf(id: string): Promise<Buffer> {
    return this.salesInvoicesRepository.downloadPdf(id);
  }
}