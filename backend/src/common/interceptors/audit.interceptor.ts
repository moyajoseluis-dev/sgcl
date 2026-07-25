import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;

    // Solo auditar peticiones que modifiquen datos (POST, PUT, DELETE)
    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      const user = (request as any).user; // El usuario inyectado por el JwtAuthGuard
      
      // Extraemos la entidad y la acción de la URL
      const urlParts = request.url.split('/').filter(p => p && !p.includes('?'));
      const entity = urlParts[2] ? urlParts[2].charAt(0).toUpperCase() + urlParts[2].slice(1) : 'Unknown';
      
      let action = 'UNKNOWN';
      if (method === 'POST') action = 'CREATE';
      if (method === 'PUT') action = 'UPDATE';
      if (method === 'DELETE') action = 'DELETE';

      return next.handle().pipe(
        tap(async (data) => {
          try {
            // Si la petición creó algo, data tendrá el ID
            const entityId = data?.id || (data && typeof data === 'object' ? Object.values(data)[0] : null);

            await this.prisma.activityLog.create({
              data: {
                userId: user?.id || null,
                action,
                entity,
                entityId: entityId ? Number(entityId) : null,
                details: `El usuario ${user?.email || 'Sistema'} realizó ${action} en ${entity}`,
                ipAddress: request.ip,
              },
            });
          } catch (error) {
            console.error('Error al guardar log de auditoría:', error);
          }
        }),
      );
    }

    return next.handle();
  }
}