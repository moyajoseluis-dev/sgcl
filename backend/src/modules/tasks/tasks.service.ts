import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskDto) {
    return this.prisma.contractTask.create({
      data: dto,
    });
  }

  async findByContract(contractId: number) {
    return this.prisma.contractTask.findMany({
      where: { contractId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Ejecutar una tarea (Cambia estado a EXECUTED y guarda la fecha)
  async execute(taskId: number) {
    return this.prisma.contractTask.update({
      where: { id: taskId },
      data: { 
        status: 'EXECUTED',
        executedAt: new Date()
      },
    });
  }
}