import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/modules/users/users.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    // 1. Buscar usuario real en base de datos
    const user = await this.usersService.findByEmail(dto.username);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Comparar contraseñas encriptadas
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Generar JWT
    const payload: JwtPayload = {
      sub: user.id.toString(),
      username: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 28800,
      username: user.email,
      role: user.role, // <--- AGREGA ESTA LÍNEA
    };
  }
}