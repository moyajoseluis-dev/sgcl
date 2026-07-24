import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { LogisticsService } from './logistics.service';
import { CreateStockMovementDto } from './dto/create-movement.dto';

@ApiTags('Logistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'logistics',
  version: '1',
})
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Get('products')
  findProducts(@Query('search') search?: string) {
    return this.logisticsService.findProducts(search);
  }

  @Post('movements')
  createMovement(@Body() dto: CreateStockMovementDto) {
    return this.logisticsService.createMovement(dto);
  }

  @Get('movements/:contractId')
  findMovementsByContract(@Param('contractId', ParseIntPipe) contractId: number) {
    return this.logisticsService.findMovementsByContract(contractId);
  }
}