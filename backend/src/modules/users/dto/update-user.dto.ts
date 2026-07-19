import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// Hereda todos los campos de CreateUserDto pero los hace opcionales
export class UpdateUserDto extends PartialType(CreateUserDto) {}