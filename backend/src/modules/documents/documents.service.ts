import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadFile(contractId: number, file: Express.Multer.File) {
    if (!file) throw new NotFoundException('No se encontró el archivo');

    // Determinar el tipo de archivo
    const ext = path.extname(file.originalname).toLowerCase();
    let fileType = 'OTHER';
    if (ext === '.pdf') fileType = 'PDF';
    else if (['.doc', '.docx'].includes(ext)) fileType = 'WORD';
    else if (['.xls', '.xlsx'].includes(ext)) fileType = 'EXCEL';
    else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) fileType = 'IMAGE';

    // Guardar en base de datos
    return this.prisma.contractDocument.create({
      data: {
        contractId,
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        fileType,
      }
    });
  }

  async findByContract(contractId: number) {
    return this.prisma.contractDocument.findMany({
      where: { contractId },
      orderBy: { uploadedAt: 'desc' }
    });
  }

  async remove(id: number) {
    const doc = await this.prisma.contractDocument.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Documento no encontrado');

    // Borrar archivo físico
    const filePath = path.join(process.cwd(), doc.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return this.prisma.contractDocument.delete({ where: { id } });
  }
}