import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@ApiTags('Contracts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) // Cualquier usuario logueado puede ver/crear contratos
@Controller({
  path: 'contracts',
  version: '1',
})
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  findAll() {
    return this.contractsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contractsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateContractDto) {
    return this.contractsService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateContractDto) {
    return this.contractsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contractsService.remove(id);
  }
}