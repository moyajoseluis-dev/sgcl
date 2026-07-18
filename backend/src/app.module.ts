import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { validate } from './config/validation';
import { AuthModule } from './modules/auth/auth.module';
import { SalesModule } from './modules/sales/sales.module';
import { LaudusSdkModule } from './laudus-sdk/laudus-sdk.module';
import { PrismaModule } from './prisma/prisma.module'; // <--- Asegúrate de tener esto

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validate,
    }),
    PrismaModule, // <--- Y aquí
    AuthModule,
    LaudusSdkModule,
    SalesModule,
  ],
})
export class AppModule {}