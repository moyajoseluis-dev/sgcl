import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { validate } from './config/validation';
import { AuthModule } from './modules/auth/auth.module';
import { SalesModule } from './modules/sales/sales.module';
import { UsersModule } from './modules/users/users.module'; // <--- Añadido
import { LaudusSdkModule } from './laudus-sdk/laudus-sdk.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { PurchasesModule } from './modules/purchases/purchases.module';

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
    ContractsModule,
    PurchasesModule,
  ],
})
export class AppModule {}
