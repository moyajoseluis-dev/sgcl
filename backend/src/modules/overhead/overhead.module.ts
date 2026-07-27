import { Module } from '@nestjs/common';
import { OverheadController } from './overhead.controller';
import { OverheadService } from './overhead.service';

@Module({
  controllers: [OverheadController],
  providers: [OverheadService],
  exports: [OverheadService], // Lo exportamos para que el módulo financiero lo use después
})
export class OverheadModule {}