import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { BillingService } from './billing.service';
import { CreateBillingCycleDto } from './dto/create-billing-cycle.dto';
import { AttachDocumentDto } from './dto/attach-document.dto';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'billing',
  version: '1',
})
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('cycle')
  createCycle(@Body() dto: CreateBillingCycleDto) {
    return this.billingService.createCycle(dto);
  }

  @Get('contract/:contractId')
  getCyclesByContract(@Param('contractId', ParseIntPipe) contractId: number) {
    return this.billingService.getCyclesByContract(contractId);
  }

  @Post('cycle/:cycleId/document')
  attachDocument(
    @Param('cycleId', ParseIntPipe) cycleId: number,
    @Body() dto: AttachDocumentDto,
  ) {
    return this.billingService.attachDocument(cycleId, dto);
  }

  @Post('cycle/:cycleId/submit')
  submitCycle(@Param('cycleId', ParseIntPipe) cycleId: number) {
    return this.billingService.submitCycle(cycleId);
  }

  @Post('cycle/:cycleId/approve')
  approveCycle(@Param('cycleId', ParseIntPipe) cycleId: number) {
    return this.billingService.approveCycle(cycleId);
  }

    @Post('cycle/:cycleId/reject')
  rejectCycle(@Param('cycleId', ParseIntPipe) cycleId: number) {
    return this.billingService.rejectCycle(cycleId);
  }

  @Post('cycle/:cycleId/invoice')
  invoiceCycle(@Param('cycleId', ParseIntPipe) cycleId: number) {
    return this.billingService.invoiceCycle(cycleId);
  }
}