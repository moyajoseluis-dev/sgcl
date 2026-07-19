import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CustomersRepository } from '@/laudus-sdk/repositories/customers.repository';

@Injectable()
export class SyncService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customersRepo: CustomersRepository,
  ) {}

  async getStatus() {
    const setting = await this.prisma.setting.findUnique({ where: { key: 'lastSyncAt' } });
    return { lastSyncAt: setting?.value || null };
  }

  async syncNow() {
    const setting = await this.prisma.setting.findUnique({ where: { key: 'lastSyncAt' } });
    const now = new Date();

    // LÍMITE DE TIEMPO (THROTTLE)
    if (setting) {
      const lastSync = new Date(setting.value);
      const diffMs = now.getTime() - lastSync.getTime();
      const diffMins = Math.round(diffMs / 60000);

      if (diffMins < 5) {
        throw new BadRequestException(`Debes esperar ${5 - diffMins} minutos para volver a sincronizar y no sobrecargar Laudus.`);
      }
    }

    let syncedCustomers = 0;

    try {
      // 1. Pedir clientes a Laudus (Traemos los primeros 1000)
      const response: unknown = await this.customersRepo.list({
        options: { offset: 0, limit: 1000 },
        fields: ["customerId", "name", "vatId", "email", "phone1"], // <--- Cambiado a phone1
        filterBy: [],
        orderBy: [{ field: "customerId", direction: "ASC" }]
      });

      // 2. Parsear la respuesta
      let customers: any[] = [];
      if (typeof response === 'string') {
        customers = response.split('\n').slice(1).map(line => {
          const [id, name, vatId, email, phone1] = line.split(','); // <--- Cambiado a phone1
          return {
            customerId: Number(id?.replace(/"/g, '')),
            name: name?.replace(/"/g, '') || '',
            vatId: vatId?.replace(/"/g, '') || null,
            email: email?.replace(/"/g, '') || null,
            phone: phone1?.replace(/"/g, '') || null, // Lo guardamos en nuestro modelo como 'phone'
          };
        }).filter(c => c.customerId);
      } else if (Array.isArray(response)) {
        // Si viene en JSON, mapeamos phone1 a phone
        customers = (response as any[]).map(c => ({
          ...c,
          phone: c.phone1
        }));
      } else if (response && typeof response === 'object' && 'rows' in response) {
        customers = ((response as any).rows as any[]).map(c => ({
          ...c,
          phone: c.phone1
        }));
      }

      // 3. Guardar en nuestra base de datos local (Upsert)
      for (const customer of customers) {
        await this.prisma.customer.upsert({
          where: { customerId: customer.customerId },
          update: {
            name: customer.name,
            vatId: customer.vatId,
            email: customer.email,
            phone: customer.phone, // Guardamos el phone mapeado
          },
          create: {
            customerId: customer.customerId,
            name: customer.name,
            vatId: customer.vatId,
            email: customer.email,
            phone: customer.phone,
          },
        });
        syncedCustomers++;
      }
    } catch (error) {
      console.error('Error durante la sincronización con Laudus:', error);
      throw new BadRequestException('Hubo un error al contactar a Laudus durante la sincronización.');
    }

    // 4. Guardar la fecha de sincronización
    await this.prisma.setting.upsert({
      where: { key: 'lastSyncAt' },
      update: { value: now.toISOString() },
      create: { key: 'lastSyncAt', value: now.toISOString() },
    });

    return { 
      message: `Sincronización completada. ${syncedCustomers} clientes actualizados.`, 
      lastSyncAt: now.toISOString() 
    };
  }
}