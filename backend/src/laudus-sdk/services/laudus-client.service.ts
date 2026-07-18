import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';

import { LaudusAuthService } from './laudus-auth.service';

@Injectable()
export class LaudusClientService {
  constructor(
    private readonly http: HttpService,
    private readonly auth: LaudusAuthService,
    private readonly config: ConfigService,
  ) {}

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const token = await this.auth.getToken();
    const url = `${this.config.getOrThrow<string>('laudus.baseUrl')}${endpoint}`;

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...config?.headers,
    };

    const requestConfig: AxiosRequestConfig = { ...config, headers };

    let response;

    switch (method) {
      case 'GET':
        response = await firstValueFrom(this.http.get<T>(url, requestConfig));
        break;
      case 'POST':
        response = await firstValueFrom(this.http.post<T>(url, body, requestConfig));
        break;
      case 'PUT':
        response = await firstValueFrom(this.http.put<T>(url, body, requestConfig));
        break;
      case 'DELETE':
        response = await firstValueFrom(this.http.delete<T>(url, requestConfig));
        break;
    }

    return response!.data;
  }

  public get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  public post<T>(endpoint: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('POST', endpoint, body, config);
  }

  public put<T>(endpoint: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('PUT', endpoint, body, config);
  }

  public delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }
}