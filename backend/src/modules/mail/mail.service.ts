import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

//const aws3 = require('@aws-sdk/client-ses');

@Injectable()
export class MailService {
  private logger = new Logger('MailService');

  generateEmailCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async sendMailForget(options: {
    from: string;
    receiverEmail: string;
    subject: string;
    code: string;
  }): Promise<void> {
    const { receiverEmail, subject, from, code } = options;

    try {
      const transport = nodemailer.createTransport({
        port: 465,
        host: 'email-smtp.eu-west-1.amazonaws.com',
        secure: true,
        auth: {
          user: 'AKIAYS2NSEDVKIPENQ5V',
          pass: 'BPK4RX5mbK/Sjns+4UeipfG0l2dmKDJHkVo9P8nNNGjp',
        },
      });
      await transport.sendMail({
        from,
        to: receiverEmail,
        subject,
        text: `Code to reset your password: ${code}`,
      });

      this.logger.debug('Email sent successfully to:', receiverEmail);
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
  }
}
