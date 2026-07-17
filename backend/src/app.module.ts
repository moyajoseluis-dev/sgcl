import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { validate } from './config/validation';
import { AuthModule } from './modules/auth/auth.module';
import { LaudusSdkModule } from './laudus-sdk/laudus-sdk.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validate,
    }),
    AuthModule,
    LaudusSdkModule, // SDK de Laudus activado
  ],
})
export class AppModule {}