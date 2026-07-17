import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { TokenModel } from '../models/token.model';

@Injectable()
export class LaudusAuthService {
  private readonly logger = new Logger(LaudusAuthService.name);
  private token?: TokenModel;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  public async getToken(): Promise<string> {
    // Si tenemos un token y no ha expirado, lo retornamos
    if (this.token && this.token.expiration > new Date()) {
      return this.token.token;
    }

    // Si no, nos logueamos de nuevo
    await this.login();
    return this.token!.token;
  }

  private async login(): Promise<void> {
    const body: LoginRequest = {
      userName: this.config.getOrThrow<string>('laudus.username'),
      password: this.config.getOrThrow<string>('laudus.password'),
      companyVATId: this.config.getOrThrow<string>('laudus.companyVatId'),
    };

    const url = `${this.config.getOrThrow<string>('laudus.baseUrl')}/security/login`;

    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(url, body),
      );

      this.token = {
        token: response.data.token,
        expiration: new Date(response.data.expiration),
      };

      this.logger.log('✅ Autenticación exitosa con Laudus API');
    } catch (error) {
      this.logger.error('❌ Error al autenticar con Laudus API', error);
      throw error;
    }
  }
}