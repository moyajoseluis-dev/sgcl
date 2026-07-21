import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {
    // Configurar el transportador de correo solo si hay credenciales
    const emailUser = this.config.get<string>('EMAIL_USER');
    const emailPass = this.config.get<string>('EMAIL_PASS');
    const emailPort = Number(this.config.get<string>('EMAIL_PORT'));
    if (emailUser && emailPass) {
      this.transporter = nodemailer.createTransport({
        host: this.config.get<string>('EMAIL_HOST'),
        port: emailPort,
        secure: emailPort === 465, // true si es 465, false si es 587
        auth: { user: emailUser, pass: emailPass },
      });
    }
  }

  // 1. Enviar Correo Electrónico
  async sendEmail(to: string, subject: string, text: string) {
    if (!this.transporter) {
      this.logger.warn(`📧 [EMAIL OMITIDO] No hay credenciales SMTP configuradas. Destino: ${to}`);
      return { success: false, message: 'Email no configurado' };
    }

    try {
      await this.transporter.sendMail({
        from: this.config.get<string>('EMAIL_FROM'),
        to,
        subject,
        text,
      });
      this.logger.log(`📧 [EMAIL ENVIADO] Para: ${to} | Asunto: ${subject}`);
      return { success: true, message: 'Email enviado' };
    } catch (error) {
      this.logger.error(`Error al enviar email a ${to}:`, error);
      return { success: false, message: 'Error al enviar email' }; // <--- POR ESTO
    }
  }

    // 2. Enviar WhatsApp vía Wazzup
  async sendWhatsApp(phone: string, message: string) {
    const apiKey = this.config.get<string>('WAZZUP_API_KEY');
    const channelId = this.config.get<string>('WAZZUP_CHANNEL_ID');
    
    if (!apiKey || !channelId) {
      this.logger.warn(`🟢 [WHATSAPP OMITIDO] Faltan credenciales de Wazzup. Destino: ${phone}`);
      return { success: false, message: 'WhatsApp no configurado' };
    }

    // Wazzup exige el número limpio + @c.us
    const cleanPhone = phone.replace(/\D/g, '');
    const chatId = `${cleanPhone}@c.us`;

    try {
      const response = await firstValueFrom(
        this.http.post(
          'https://api.wazzup24.com/v3/message',
          {
            channelId: channelId,
            chatType: 'whatsapp',
            chatId: chatId,
            text: message,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        )
      );
      this.logger.log(`🟢 [WHATSAPP ENVIADO] Para: ${cleanPhone} | Status: ${response.status}`);
      return { success: true, message: 'WhatsApp enviado' };
    } catch (error: any) {
      this.logger.error(`Error al enviar WhatsApp a ${cleanPhone}:`, error.response?.data || error.message);
      return { success: false, message: 'Error al enviar WhatsApp' };
    }
  }
}