import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

      async getStats() {
    // 1. Conteos básicos
    const totalUsers = await this.prisma.user.count();
    const totalContracts = await this.prisma.contract.count();
    const activeContracts = await this.prisma.contract.count({
      where: { status: 'ACTIVE' },
    });

    // 2. Sumar montos de contratos adjudicados
    const contractsAgg = await this.prisma.contract.aggregate({
      _sum: { amount: true },
    });

    // 3. Sumar montos de Estados de Pago (Facturado/Procesado)
    const billingAgg = await this.prisma.billingCycle.aggregate({
      _sum: { totalAmount: true },
    });

    // 4. Contar tareas pendientes (Operación)
    const pendingTasks = await this.prisma.contractTask.count({
      where: { status: 'PENDING' },
    });

    // 5. Sumar gastos de Fondo Fijo aprobados
    const expensesAgg = await this.prisma.pettyCashExpense.aggregate({
      _sum: { amount: true },
      where: { status: 'APPROVED' },
    });

    // 6. Datos para el gráfico de torta (Estados de contratos)
    const pendingContracts = await this.prisma.contract.count({ where: { status: 'PENDING' } });
    const expiredContracts = await this.prisma.contract.count({ where: { status: 'EXPIRED' } });
    const cancelledContracts = await this.prisma.contract.count({ where: { status: 'CANCELLED' } });

    return {
      totalUsers,
      totalContracts,
      activeContracts,
      pendingTasks,
      totalAmount: contractsAgg._sum.amount || 0,
      totalFacturado: billingAgg._sum.totalAmount || 0,
      pettyCashSpent: expensesAgg._sum.amount || 0,
      chartData: {
        labels: ['Activos', 'Pendientes', 'Vencidos', 'Cancelados'],
        datasets: [
          {
            backgroundColor: ['#10b981', '#f59e0b', '#6b7280', '#ef4444'],
            data: [activeContracts, pendingContracts, expiredContracts, cancelledContracts],
          },
        ],
      },
    };
  }
}