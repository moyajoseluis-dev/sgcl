import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { OverheadService } from './overhead.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@ApiTags('Overhead (Gastos Generales)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'overhead', version: '1' })
export class OverheadController {
  constructor(private readonly overheadService: OverheadService) {}

  @Post()
  create(@Body() dto: CreateExpenseDto) {
    return this.overheadService.create(dto);
  }

  @Get()
  findAll() {
    return this.overheadService.findAll();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.overheadService.remove(id);
  }
}