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
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ScheduleModule } from '@nestjs/schedule'; // <--- Importar
import { SyncModule } from './modules/sync/sync.module';
import { CustomersModule } from './modules/customers/customers.module';
import { NotificationsModule } from './modules/notifications/notifications.module'; // <--- Importado
import { PettyCashModule } from './modules/petty-cash/petty-cash.module';
import { LogisticsModule } from './modules/logistics/logistics.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { BillingModule } from './modules/billing/billing.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { LogsModule } from './modules/logs/logs.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ServeStaticModule } from '@nestjs/serve-static'; // Para servir los archivos estáticos
import { join } from 'path';


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
    DashboardModule, 
    SyncModule,
    CustomersModule,
    PettyCashModule,
    LogisticsModule,
    TasksModule,
    BillingModule,
    LogsModule,
    ReportsModule,
    DocumentsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',}),
    NotificationsModule, // <--- Añadido aquí
    ScheduleModule.forRoot(), // <--- Añadir esto
  ],
})
export class AppModule {}
