import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateContractDto) {
    return this.prisma.contract.create({ data: dto });
  }

  findAll() {
    return this.prisma.contract.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        establishment: true,
        pettyCash: true,
        costCenter: true,
      }
    });

    if (!contract) throw new NotFoundException('Contrato no encontrado');

    // Simulación de KPIs (Luego se reemplazará por datos reales de Laudus)
    return {
      ...contract,
      kpis: {
        facturado: 420000000,
        cobrado: 350000000,
        costo: 290000000,
        margen: 31, // Porcentaje
        avance: contract.progress || 48, // Porcentaje
        documentosPendientes: 17
      }
    };
  }

  update(id: number, dto: UpdateContractDto) {
    return this.prisma.contract.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.contract.delete({ where: { id } });
  }
}