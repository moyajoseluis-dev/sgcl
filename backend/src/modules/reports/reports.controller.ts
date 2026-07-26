import { Controller, Get, Param, ParseIntPipe, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'reports', version: '1' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('billing-cycle/:cycleId/pdf')
  async downloadExecutionReport(
    @Param('cycleId', ParseIntPipe) cycleId: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.reportsService.generateExecutionReport(cycleId);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="informe-ejecucion-${cycleId}.pdf"`,
    });
    
    res.send(pdfBuffer);
  }
}
