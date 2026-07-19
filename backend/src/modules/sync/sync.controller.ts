import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SyncService } from './sync.service';

@ApiTags('Sync')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'sync',
  version: '1',
})
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('status')
  getStatus() {
    return this.syncService.getStatus();
  }

  @Post('now')
  syncNow() {
    return this.syncService.syncNow();
  }
}