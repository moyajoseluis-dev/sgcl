import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
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

    // Firmar un documento PDF existente
  async signDocument(docId: number, signerName: string, signerRut: string, signatureImageBase64: string) {
    // 1. Buscar el documento original
    const doc = await this.prisma.contractDocument.findUnique({ where: { id: docId } });
    if (!doc) throw new NotFoundException('Documento no encontrado');
    if (doc.fileType !== 'PDF') throw new BadRequestException('Solo se pueden firmar archivos PDF.');

    const filePath = path.join(process.cwd(), doc.fileUrl);
    const existingPdfBytes = fs.readFileSync(filePath);

    // 2. Cargar el PDF con pdf-lib
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

        // 3. Procesar la imagen de la firma (Acepta PNG y JPG)
    let signatureImage;
    if (signatureImageBase64.includes('image/png')) {
      const base64Data = signatureImageBase64.replace(/^data:image\/png;base64,/, "");
      signatureImage = await pdfDoc.embedPng(Buffer.from(base64Data, 'base64'));
    } else if (signatureImageBase64.includes('image/jpeg')) {
      const base64Data = signatureImageBase64.replace(/^data:image\/jpeg;base64,/, "");
      signatureImage = await pdfDoc.embedJpg(Buffer.from(base64Data, 'base64'));
    } else {
      throw new BadRequestException('Formato de imagen no soportado. Sube un PNG o JPG.');
    }

    // Dimensiones y posición (Esquina inferior derecha)
    const imgWidth = 150;
    const imgHeight = signatureImage.height * (imgWidth / signatureImage.width);
    const margin = 50;
    const x = firstPage.getWidth() - imgWidth - margin;
    const y = margin;

    // 4. Dibujar la imagen de la firma
    firstPage.drawImage(signatureImage, {
      x,
      y,
      width: imgWidth,
      height: imgHeight,
    });

    // 5. Dibujar el texto legal (Firmante, RUT, Fecha)
    const textY = y - 15;
    const dateStr = new Date().toLocaleString('es-CL');
    
    firstPage.drawText(`Firmado digitalmente por: ${signerName}`, {
      x: x, y: textY, size: 8, font: helveticaFont, color: rgb(0, 0, 0),
    });
    firstPage.drawText(`RUT: ${signerRut}  |  Fecha: ${dateStr}`, {
      x: x, y: textY - 12, size: 8, font: helveticaFont, color: rgb(0, 0, 0),
    });

    // 6. Guardar el nuevo PDF firmado
    const signedPdfBytes = await pdfDoc.save();
    const signedFileName = `signed_${Date.now()}.pdf`;
    const signedFilePath = path.join(process.cwd(), 'uploads', signedFileName);
    fs.writeFileSync(signedFilePath, signedPdfBytes);

    // 7. Registrar el nuevo documento en la base de datos
    return this.prisma.contractDocument.create({
      data: {
        contractId: doc.contractId,
        fileName: `FIRMADO_${doc.fileName}`,
        fileUrl: `/uploads/${signedFileName}`,
        fileType: 'PDF',
      }
    });
  }
}