import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CustomersRepository } from '@/laudus-sdk/repositories/customers.repository';
import { ProductsRepository } from '@/laudus-sdk/repositories/products.repository';

@Injectable()
export class SyncService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customersRepo: CustomersRepository,
    private readonly productsRepo: ProductsRepository,
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
    let syncedProducts = 0;

    try {
      // --- SINCRONIZACIÓN DE CLIENTES ---
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
      // --- FIN SINCRONIZACIÓN DE CLIENTES ---
           // --- SINCRONIZACIÓN DE PRODUCTOS ---
      const prodResponse: unknown = await this.productsRepo.list({
        options: { offset: 0, limit: 1000 },
        fields: ["productId", "sku", "description", "unitOfMeasure"],
        filterBy: [],
        orderBy: [{ field: "productId", direction: "ASC" }]
      });

      let products: any[] = [];
      if (typeof prodResponse === 'string') {
        // Si es CSV, lo separamos por líneas
        products = prodResponse.split('\n').slice(1).map(line => {
          // Dividimos solo por las primeras 3 comas para no romper el nombre si tiene comas
          const parts = line.split(',');
          const id = parts[0]?.replace(/"/g, '');
          const rawSku = parts[1]?.replace(/"/g, '');
          const unit = parts[parts.length - 1]?.replace(/"/g, ''); // La última parte es la unidad
          
          // El nombre es todo lo que está en el medio
          const name = parts.slice(2, parts.length - 1).join(',').replace(/"/g, '') || '';
          
          return {
            id: Number(id),
            sku: rawSku || `SKU-${id}`, // Si no tiene SKU, usamos SKU-{id}
            name: name,
            unit: unit,
          };
        }).filter(p => p.id);
      } else if (Array.isArray(prodResponse)) {
        // Si es JSON
        products = (prodResponse as any[]).map(p => ({
          id: p.productId,
          sku: p.sku || `SKU-${p.productId}`, // Si no tiene SKU, usamos SKU-{id}
          name: p.description || '',
          unit: p.unitOfMeasure || null
        }));
      }

      for (const product of products) {
        await this.prisma.product.upsert({
          where: { id: product.id },
          update: { 
            sku: product.sku, 
            name: product.name, 
            unit: product.unit 
          },
          create: {
            id: product.id,
            sku: product.sku,
            name: product.name,
            unit: product.unit,
          },
        });
        syncedProducts++;
      }
      
      // --- FIN SINCRONIZACIÓN DE PRODUCTOS ---

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