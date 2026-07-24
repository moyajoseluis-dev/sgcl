import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePettyCashDto } from './dto/create-petty-cash.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class PettyCashService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Crear/Asignar Fondo Fijo a un contrato
  async createPettyCash(dto: CreatePettyCashDto) {
    const existing = await this.prisma.pettyCash.findUnique({
      where: { contractId: dto.contractId },
    });

    if (existing) {
      throw new BadRequestException('Este contrato ya tiene un fondo fijo asignado.');
    }

    return this.prisma.pettyCash.create({
      data: {
        contractId: dto.contractId,
        responsibleId: dto.responsibleId,
        assignedAmount: dto.assignedAmount,
        currentBalance: dto.assignedAmount, // El saldo inicial es el asignado
      },
    });
  }

  // 2. Registrar un gasto (Rendir boleta)
  async addExpense(pettyCashId: number, dto: CreateExpenseDto) {
    const pettyCash = await this.prisma.pettyCash.findUnique({
      where: { id: pettyCashId },
    });

    if (!pettyCash) throw new NotFoundException('Fondo fijo no encontrado');

    // Creamos el gasto en estado PENDIENTE
    return this.prisma.pettyCashExpense.create({
      data: {
        pettyCashId: pettyCash.id,
        amount: dto.amount,
        concept: dto.concept,
        receiptUrl: dto.receiptUrl,
        status: 'PENDING',
      },
    });
  }

  // 3. Aprobar un gasto (Descuenta del saldo real)
  async approveExpense(expenseId: number) {
    const expense = await this.prisma.pettyCashExpense.findUnique({
      where: { id: expenseId },
      include: { pettyCash: true },
    });

    if (!expense) throw new NotFoundException('Gasto no encontrado');
    if (expense.status !== 'PENDING') throw new BadRequestException('Este gasto ya fue procesado.');

    // Transacción para aprobar y descontar saldo simultáneamente
    return this.prisma.$transaction(async (tx) => {
      await tx.pettyCashExpense.update({
        where: { id: expenseId },
        data: { status: 'APPROVED' },
      });

      return tx.pettyCash.update({
        where: { id: expense.pettyCashId },
        data: { currentBalance: { decrement: expense.amount } },
      });
    });
  }

  // 4. Rechazar gasto
  async rejectExpense(expenseId: number) {
    const expense = await this.prisma.pettyCashExpense.findUnique({
      where: { id: expenseId },
    });

    if (!expense) throw new NotFoundException('Gasto no encontrado');
    if (expense.status !== 'PENDING') throw new BadRequestException('Este gasto ya fue procesado.');

    return this.prisma.pettyCashExpense.update({
      where: { id: expenseId },
      data: { status: 'REJECTED' },
    });
  }

  // 5. Obtener el fondo fijo de un contrato con todos sus gastos
  async getPettyCashByContract(contractId: number) {
    return this.prisma.pettyCash.findUnique({
      where: { contractId },
      include: {
        expenses: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }
}