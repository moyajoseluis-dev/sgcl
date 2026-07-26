import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { WorkflowService } from '@/modules/workflow/workflow.service';
import { CreateBillingCycleDto } from './dto/create-billing-cycle.dto';
import { AttachDocumentDto } from './dto/attach-document.dto';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService,
    private readonly workflowService: WorkflowService
  ) {}

  // 1. Crear un ciclo de facturación (Estado de Pago)
  async createCycle(dto: CreateBillingCycleDto) {
    // Buscamos todas las tareas EJECUTADAS de ese contrato para calcular el monto
    const executedTasks = await this.prisma.contractTask.findMany({
      where: { 
        contractId: dto.contractId, 
        status: 'EXECUTED' 
      },
    });

    // Sumamos los valores unitarios de las tareas ejecutadas
    const totalAmount = executedTasks.reduce((sum, task) => sum + task.unitPrice, 0);

    return this.prisma.billingCycle.create({
      data: {
        contractId: dto.contractId,
        period: dto.period,
        totalAmount: totalAmount,
        status: 'DRAFT',
      },
      include: { documents: true }
    });
  }

  // 2. Obtener los ciclos de un contrato
  async getCyclesByContract(contractId: number) {
    return this.prisma.billingCycle.findMany({
      where: { contractId },
      include: { documents: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 3. Adjuntar un documento (F-30, Informes, etc.)
  async attachDocument(cycleId: number, dto: AttachDocumentDto) {
    const cycle = await this.prisma.billingCycle.findUnique({ where: { id: cycleId } });
    if (!cycle) throw new NotFoundException('Ciclo de facturación no encontrado');
    
    if (cycle.status !== 'DRAFT') {
      throw new BadRequestException('Solo se pueden adjuntar documentos a ciclos en estado DRAFT');
    }

    return this.prisma.billingDocument.create({
      data: {
        billingCycleId: cycleId,
        docType: dto.docType,
        fileName: dto.fileName,
        fileUrl: dto.fileUrl,
      }
    });
  }

  // 4. Enviar al cliente (Cambiar estado a SUBMITTED)
  async submitCycle(cycleId: number) {
    const cycle = await this.prisma.billingCycle.findUnique({
      where: { id: cycleId },
      include: { documents: true }
    });

    if (!cycle) throw new NotFoundException('Ciclo no encontrado');
    if (cycle.documents.length === 0) {
      throw new BadRequestException('No se puede enviar el paquete sin documentos adjuntos.');
    }

    // VALIDACIÓN DEL WORKFLOW
    this.workflowService.validateTransition('BillingCycle', cycle.status, 'SUBMITTED');

    return this.prisma.billingCycle.update({
      where: { id: cycleId },
      data: { status: 'SUBMITTED' },
    });
  }

  async approveCycle(cycleId: number) {
    const cycle = await this.prisma.billingCycle.findUnique({ where: { id: cycleId } });
    if (!cycle) throw new NotFoundException('Ciclo no encontrado');

    // VALIDACIÓN DEL WORKFLOW
    this.workflowService.validateTransition('BillingCycle', cycle.status, 'APPROVED');

    return this.prisma.billingCycle.update({
      where: { id: cycleId },
      data: { status: 'APPROVED' },
    });
  }

  // Nuevo método para rechazar
  async rejectCycle(cycleId: number) {
    const cycle = await this.prisma.billingCycle.findUnique({ where: { id: cycleId } });
    if (!cycle) throw new NotFoundException('Ciclo no encontrado');

    this.workflowService.validateTransition('BillingCycle', cycle.status, 'REJECTED');

    // Al rechazar, el workflow dice que vuelve a DRAFT para poder modificar
    return this.prisma.billingCycle.update({
      where: { id: cycleId },
      data: { status: 'DRAFT' },
    });
  }

  // Nuevo método para marcar como facturado en Laudus
  async invoiceCycle(cycleId: number) {
    const cycle = await this.prisma.billingCycle.findUnique({ where: { id: cycleId } });
    if (!cycle) throw new NotFoundException('Ciclo no encontrado');

    this.workflowService.validateTransition('BillingCycle', cycle.status, 'INVOICED');

    return this.prisma.billingCycle.update({
      where: { id: cycleId },
      data: { status: 'INVOICED' },
    });
  }
}
