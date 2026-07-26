import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async generateExecutionReport(cycleId: number): Promise<Buffer> {
    // 1. Buscar el ciclo y sus tareas ejecutadas
    const cycle = await this.prisma.billingCycle.findUnique({
      where: { id: cycleId },
      include: {
        contract: true,
        documents: true,
      },
    });

    if (!cycle) throw new NotFoundException('Ciclo de facturación no encontrado');

    // Buscamos las tareas ejecutadas de ese contrato
    const tasks = await this.prisma.contractTask.findMany({
      where: { contractId: cycle.contractId, status: 'EXECUTED' },
    });

    // 2. Construir el HTML del informe
    const taskRowsHtml = tasks.map(task => `
      <tr>
        <td>${task.description}</td>
        <td style="text-align: center;">${task.type}</td>
        <td style="text-align: right;">$${task.unitPrice.toLocaleString('es-CL')}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; color: #2563eb; }
          .subtitle { font-size: 14px; color: #666; }
          .info-box { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
          th { background: #f1f5f9; text-align: left; color: #475569; }
          .total { margin-top: 20px; text-align: right; font-size: 18px; font-weight: bold; color: #16a34a; }
          .footer { margin-top: 50px; font-size: 10px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Informe de Ejecución de Servicios</div>
          <div class="subtitle">Estado de Pago: ${cycle.period}</div>
        </div>

        <div class="info-box">
          <p><strong>Contrato:</strong> ${cycle.contract.title}</p>
          <p><strong>Cliente:</strong> ${cycle.contract.entityName}</p>
        </div>

        <h3>Detalle de Tareas Ejecutadas</h3>
        <table>
          <thead>
            <tr>
              <th>Descripción</th>
              <th style="text-align: center;">Tipo</th>
              <th style="text-align: right;">Valor Unitario</th>
            </tr>
          </thead>
          <tbody>
            ${taskRowsHtml}
          </tbody>
        </table>

        <div class="total">
          Total a Facturar: $${cycle.totalAmount.toLocaleString('es-CL')}
        </div>

        <div class="footer">
          Documento generado automáticamente por SGCL - ${new Date().toLocaleDateString('es-CL')}
        </div>
      </body>
      </html>
    `;

    // 3. Usar Puppeteer para convertir el HTML a PDF
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdfData = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    // Convertimos Uint8Array a Buffer nativo de Node.js
    return Buffer.from(pdfData); 
  }
}