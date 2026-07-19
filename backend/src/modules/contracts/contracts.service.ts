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
    const contract = await this.prisma.contract.findUnique({ where: { id } });
    if (!contract) throw new NotFoundException('Contrato no encontrado');
    return contract;
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