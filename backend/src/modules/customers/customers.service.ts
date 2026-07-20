import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client'; // <--- Importar Prisma

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number, limit: number, search: string) {
    const skip = (page - 1) * limit;
    
    // Tipamos explícitamente como Prisma.CustomerWhereInput
    const where: Prisma.CustomerWhereInput = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { vatId: { contains: search, mode: 'insensitive' } },
      ]
    } : {};

    const customers = await this.prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
    });

    const total = await this.prisma.customer.count({ where });

    return {
      data: customers,
      total,
      page,
      limit,
    };
  }
}