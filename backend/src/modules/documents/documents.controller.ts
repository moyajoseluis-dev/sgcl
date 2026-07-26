import { Controller, Delete, Get, Param, Body, ParseIntPipe, Post, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { DocumentsService } from './documents.service';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'documents',
  version: '1',
})
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload/:contractId')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  uploadFile(@Param('contractId', ParseIntPipe) contractId: number, @UploadedFile() file: Express.Multer.File) {
    return this.documentsService.uploadFile(contractId, file);
  }

  @Get('contract/:contractId')
  findByContract(@Param('contractId', ParseIntPipe) contractId: number) {
    return this.documentsService.findByContract(contractId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.remove(id);
  }

  @Post(':id/sign')
  signDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { signerName: string; signerRut: string; signatureImage: string },
  ) {
    return this.documentsService.signDocument(
      id,
      body.signerName,
      body.signerRut,
      body.signatureImage
    );
  }
}