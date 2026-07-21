import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NotificationsService } from './notifications.service';

@Global()
@Module({
  imports: [HttpModule], // <--- Añadido
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}