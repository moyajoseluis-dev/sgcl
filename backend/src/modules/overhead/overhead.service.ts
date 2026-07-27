import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class OverheadService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateExpenseDto) {
    return this.prisma.generalExpense.create({ data: dto });
  }

  async findAll() {
    return this.prisma.generalExpense.findMany({ orderBy: { period: 'desc' } });
  }

  // Método para calcular la distribución de gastos en un contrato específico
  async getDistributedOverheadForContract(contractId: number, period: string) {
    const totalExpenses = await this.prisma.generalExpense.aggregate({
      where: { period },
      _sum: { amount: true },
    });

    const totalContracts = await this.prisma.contract.count({ where: { status: 'ACTIVE' } });

    if (totalContracts === 0) return 0;

    // Se reparte equitativamente entre los contratos activos
    const distributedAmount = (totalExpenses._sum.amount || 0) / totalContracts;
    return distributedAmount;
  }

  async remove(id: number) {
    return this.prisma.generalExpense.delete({ where: { id } });
  }
}