import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: String(process.env.SMTP_SECURE ?? 'false') === 'true',
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });

  async send(params: {
    to: string;
    subject: string;
    text: string;
    icsFilename?: string;
    icsContent?: string;
  }) {
    const from = process.env.MAIL_FROM || 'no-reply@example.com';

    await this.transporter.sendMail({
      from,
      to: params.to,
      subject: params.subject,
      text: params.text,
      attachments: params.icsContent
        ? [
            {
              filename: params.icsFilename ?? 'invite.ics',
              content: params.icsContent,
              contentType: 'text/calendar; charset=utf-8',
            },
          ]
        : [],
    });
  }
}
