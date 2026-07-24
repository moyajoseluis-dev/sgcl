import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { PettyCashService } from './petty-cash.service';
import { CreatePettyCashDto } from './dto/create-petty-cash.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';

@ApiTags('PettyCash')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'petty-cash',
  version: '1',
})
export class PettyCashController {
  constructor(private readonly pettyCashService: PettyCashService) {}

  @Post()
  createPettyCash(@Body() dto: CreatePettyCashDto) {
    return this.pettyCashService.createPettyCash(dto);
  }

  @Get('contract/:contractId')
  getPettyCashByContract(@Param('contractId', ParseIntPipe) contractId: number) {
    return this.pettyCashService.getPettyCashByContract(contractId);
  }

  @Post(':pettyCashId/expense')
  addExpense(
    @Param('pettyCashId', ParseIntPipe) pettyCashId: number,
    @Body() dto: CreateExpenseDto,
  ) {
    return this.pettyCashService.addExpense(pettyCashId, dto);
  }

  @Post('expense/:expenseId/approve')
  approveExpense(@Param('expenseId', ParseIntPipe) expenseId: number) {
    return this.pettyCashService.approveExpense(expenseId);
  }

  @Post('expense/:expenseId/reject')
  rejectExpense(@Param('expenseId', ParseIntPipe) expenseId: number) {
    return this.pettyCashService.rejectExpense(expenseId);
  }
}