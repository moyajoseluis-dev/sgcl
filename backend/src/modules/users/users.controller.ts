import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UsersService } from './users.service';
import { NotificationsService } from '@/modules/notifications/notifications.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService, // Inyectado aquí
  ) {}

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // ENDPOINT DE PRUEBA PARA NOTIFICACIONES
  @Post('test-notification')
  @Roles('ADMIN')
  async testNotification() {
    // 1. Prueba de Correo
    await this.notificationsService.sendEmail('joseluis.moya@bingenieria.cl', 'Prueba SGCL', 'Esta es una prueba de correo desde SGCL.');
    
    // 2. Prueba de WhatsApp (¡CAMBIA ESTE NÚMERO POR EL TUYO! Ej: 56912345678)
    await this.notificationsService.sendWhatsApp('56927554793', '¡Hola! Esta es una prueba de WhatsApp enviada desde el sistema SGCL.');
    
    return { message: 'Notificaciones de prueba procesadas. Revisa la consola del backend y tu WhatsApp.' };
  }

  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}