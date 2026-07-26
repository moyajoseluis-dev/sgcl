import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';
import { PrismaService } from './prisma/prisma.service';


import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Habilitar CORS para el frontend
  app.enableCors({
  origin: true, // Permite cualquier origen (ideal para Vercel)
  credentials: true,
});
  // Prefijo global para la API (ej. /api/v1/...)
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Validación estricta de datos entrantes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuración de Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SGCL API')
    .setDescription('Sistema de Gestión y Control Laudus')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocument);

 
 // Activar el Interceptor de Auditoría
  const prismaService = app.get(PrismaService);
  app.useGlobalInterceptors(new AuditInterceptor(prismaService));
 
 
 
  // Levantar el servidor
  const port = configService.get<number>('app.port') ?? 3001;
  
  //await app.listen(port);
  // El '0.0.0.0' le dice a NestJS que acepte conexiones de cualquier dispositivo en la red WiFi
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 SGCL Backend ejecutándose en: http://localhost:${port}`);
  console.log(`📚 Swagger disponible en:  http://localhost:${port}/swagger`);
}

void bootstrap();