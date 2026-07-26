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

  // Obtener la cronología unificada de un contrato
  async getTimeline(id: number) {
    const contract = await this.prisma.contract.findUnique({ where: { id } });
    if (!contract) throw new NotFoundException('Contrato no encontrado');

    // 1. Obtener eventos de distintas tablas
    const tasks = await this.prisma.contractTask.findMany({ where: { contractId: id } });
    const docs = await this.prisma.contractDocument.findMany({ where: { contractId: id } });
    const cycles = await this.prisma.billingCycle.findMany({ where: { contractId: id } });

    // 2. Formatear todo a una estructura común
    const events = [
      {
        date: contract.createdAt,
        type: 'CONTRACT_CREATED',
        title: 'Contrato Creado',
        description: `El contrato "${contract.title}" fue ingresado al sistema.`
      },
      ...tasks.map(t => ({
        date: t.executedAt || t.createdAt,
        type: t.status === 'EXECUTED' ? 'TASK_EXECUTED' : 'TASK_CREATED',
        title: `Tarea: ${t.description}`,
        description: t.status === 'EXECUTED' ? `Ejecutada por valor de $${t.unitPrice}` : 'Tarea programada/pendiente.'
      })),
      ...docs.map(d => ({
        date: d.uploadedAt,
        type: 'DOC_UPLOADED',
        title: `Documento Subido: ${d.fileName}`,
        description: `Archivo de tipo ${d.fileType} adjuntado al contrato.`
      })),
      ...cycles.map(c => ({
        date: c.createdAt,
        type: 'BILLING_CYCLE',
        title: `Estado de Pago: ${c.period}`,
        description: `Ciclo generado por monto de $${c.totalAmount}. Estado: ${c.status}.`
      })),
    ];

    // 3. Ordenar por fecha descendente (más nuevo arriba)
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

    async updateStatus(id: number, status: string) {
    const contract = await this.prisma.contract.findUnique({ where: { id } });
    if (!contract) throw new NotFoundException('Contrato no encontrado');
    
    return this.prisma.contract.update({
      where: { id },
      data: { status: status as any }, // Lo tipamos como any para simplificar, pero validamos en frontend
    });
  }


}