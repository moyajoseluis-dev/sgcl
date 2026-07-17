import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    // Validación temporal en memoria (luego será contra Base de Datos)
    if (dto.username !== 'admin' || dto.password !== 'admin') {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    const payload: JwtPayload = {
      sub: '1',
      username: dto.username,
      role: 'ADMIN',
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const expiresIn = this.configService.get<string>('jwt.expiresIn') ?? '8h';

    // Convertir "8h" a segundos para la respuesta (opcional pero profesional)
    const seconds = parseInt(expiresIn.replace(/\D/g, '')) * 3600;

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: seconds,
      username: dto.username,
    };
  }
}