import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-movement.dto';

@Injectable()
export class LogisticsService {
  constructor(private readonly prisma: PrismaService) {}

  // Buscar productos localmente (súper rápido)
  async findProducts(search?: string) {
    return this.prisma.product.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ]
      } : {},
      take: 50, // Limitamos a 50 para no cargar la memoria
      orderBy: { name: 'asc' }
    });
  }

  // Registrar un movimiento de stock
  async createMovement(dto: CreateStockMovementDto) {
    return this.prisma.stockMovement.create({ 
      data: dto,
      include: { product: true } // Devolvemos el producto con el movimiento
    });
  }

  // Ver historial de movimientos de un contrato (obra)
  async findMovementsByContract(contractId: number) {
    return this.prisma.stockMovement.findMany({
      where: { contractId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}