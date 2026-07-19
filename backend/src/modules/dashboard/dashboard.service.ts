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

    const contracts = await this.prisma.contract.findMany();
    const totalAmount = contracts.reduce((sum, c) => sum + c.amount, 0);

    return {
      totalUsers,
      totalContracts,
      activeContracts,
      totalAmount,
    };
  }
}