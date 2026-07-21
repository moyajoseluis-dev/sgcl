import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

    async getStats() {
    const totalUsers = await this.prisma.user.count();
    const totalContracts = await this.prisma.contract.count();
    const activeContracts = await this.prisma.contract.count({
      where: { status: 'ACTIVE' },
    });

    // DATOS PARA EL GRÁFICO
    const pendingContracts = await this.prisma.contract.count({ where: { status: 'PENDING' } });
    const expiredContracts = await this.prisma.contract.count({ where: { status: 'EXPIRED' } });
    const cancelledContracts = await this.prisma.contract.count({ where: { status: 'CANCELLED' } });

    const contracts = await this.prisma.contract.findMany();
    const totalAmount = contracts.reduce((sum, c) => sum + c.amount, 0);

    return {
      totalUsers,
      totalContracts,
      activeContracts,
      totalAmount,
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