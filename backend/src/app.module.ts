import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { validate } from './config/validation';
import { AuthModule } from './modules/auth/auth.module';
import { SalesModule } from './modules/sales/sales.module';
import { UsersModule } from './modules/users/users.module'; // <--- Añadido
import { LaudusSdkModule } from './laudus-sdk/laudus-sdk.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validate,
    }),
    PrismaModule,
    AuthModule,
    LaudusSdkModule,
    SalesModule,
    UsersModule, // <--- Añadido
  ],
})
export class AppModule {}