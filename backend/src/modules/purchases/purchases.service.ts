import { Injectable } from '@nestjs/common';
import { PurchaseInvoicesRepository } from '@/laudus-sdk/repositories/purchase-invoices.repository';
import { FilterByDto } from '@/laudus-sdk/dto/filter-by.dto';
import { OrderByDto } from '@/laudus-sdk/dto/order-by.dto';
import { ListPurchaseInvoicesDto } from './dto/list-purchase-invoices.dto';

@Injectable()
export class PurchasesService {
  constructor(
    private readonly purchaseInvoicesRepository: PurchaseInvoicesRepository,
  ) {}

  public async findAll(dto: ListPurchaseInvoicesDto) {
    const offset = Number(dto.offset) || 0;
    const limit = Number(dto.limit) || 10;

    let finalFilterBy: FilterByDto[] = [{ field: "issuedDate", operator: ">", value: "2023-01-01T00:00:00" }];
    if (dto.filterBy && Array.isArray(dto.filterBy) && dto.filterBy.length > 0) {
      const cleanFilters = dto.filterBy.filter(f => f && typeof f === 'object' && !Array.isArray(f) && f.field);
      if (cleanFilters.length > 0) {
        finalFilterBy = cleanFilters;
      }
    }

    let finalOrderBy: OrderByDto[] = [{ field: "issuedDate", direction: "DESC" }];
    if (dto.orderBy && Array.isArray(dto.orderBy) && dto.orderBy.length > 0) {
      const cleanOrder = dto.orderBy.filter(o => o && typeof o === 'object' && !Array.isArray(o) && o.field);
      if (cleanOrder.length > 0) {
        finalOrderBy = cleanOrder;
      }
    }

    const laudusPayload: Record<string, unknown> = {
      options: { offset, limit },
      fields: dto.fields && dto.fields.length > 0 ? dto.fields : ["purchaseInvoiceId", "issuedDate"],
      filterBy: finalFilterBy,
      orderBy: finalOrderBy
    };

    return this.purchaseInvoicesRepository.list(laudusPayload);
  }
}