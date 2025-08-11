import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as sendgrid from '@sendgrid/mail';

@Injectable()
export class MailService {
  private logger = new Logger('MailService');

  constructor() {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error(
        'SENDGRID_API_KEY is not defined in environment variables',
      );
    }
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

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
      await sendgrid.send({
        to: receiverEmail,
        from,
        subject,
        text: `Code to reset your password: ${code}`,
      });

      this.logger.debug('Email sent successfully to:', receiverEmail);
    } catch (error) {
      this.logger.error('Error sending email:', error);
      throw new BadRequestException(`Failed to send email: ${error.message}`);
    }
  }

  async sendGiftEmail(
    winnerName: string,
    giftType: string,
    shopName: string,
    receiverEmail: string,
    validFromDate: string,
    validUntilDate: string,
    emailCode?: string,
    rewardId?: string,
    shopId?: string,
    userId?: string,
    actionId?: string,
  ) {
    if (!process.env.MAIL_FROM) {
      throw new Error('MAIL_FROM is not defined in environment variables');
    }

    const redeemUrl = `${process.env.FRONTEND_URL}/user/${shopId}/redeem/${userId}/action/${actionId}`;

    const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">

        
        <h2 style="color: #333; text-align: center; margin-bottom: 20px; font-size: 24px;">
          Congratulations ${winnerName}!
        </h2>
        
        <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="font-size: 18px; color: #333; margin: 10px 0;">
            You just won a <strong style="color: #2c5aa0;">${giftType}</strong>
          </p>
          <p style="font-size: 16px; color: #666; margin: 10px 0;">
            at <strong>${shopName}</strong>
          </p>
          ${
            rewardId
              ? `
          <p style="font-size: 14px; color: #888; margin: 10px 0;">
            Reward ID: <strong>${rewardId}</strong>
          </p>
          `
              : ''
          }
        </div>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
          To redeem this gift, click the button below and present the page displayed on your screen at the counter the next time you come.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
  <a href="${redeemUrl}" target="_blank" style="background-color: #2c5aa0; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold; display: inline-block;">
    🎁 Your gift here
  </a>
</div>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="color: #856404; font-size: 16px; margin: 5px 0;">
            📅 You can pick up your gift on your next visit to us between <strong>${validFromDate}</strong> and <strong>${validUntilDate}</strong>.
          </p>
        </div>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 15px 0;">
          In the meantime, we'll keep an eye on it!
        </p>
        
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="color: #721c24; font-size: 14px; margin: 5px 0;">
            ⚠️ Be careful that after this date your gift will no longer be available.
          </p>
          <p style="color: #721c24; font-size: 14px; margin: 5px 0;">
            It would be a waste to let it slip away for someone else.
          </p>
        </div>
         
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 16px; margin: 10px 0;">
            See you soon and don't hesitate to play again next time!
          </p>
          <p style="color: #666; font-size: 16px; margin: 10px 0;">
            Who knows? You may be even luckier... 🍀
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; margin: 5px 0;">
            This email was sent from ${shopName}
          </p>
          ${
            rewardId
              ? `
          <p style="color: #999; font-size: 10px; margin: 5px 0;">
            Reference: ${rewardId}
          </p>
          `
              : ''
          }
        </div>
        
      </div>
    </div>
  `;

    try {
      await sendgrid.send({
        to: receiverEmail,
        from: process.env.MAIL_FROM,
        subject: `🎉 Congratulations ${winnerName}! Your ${giftType} is waiting for you at ${shopName}`,
        html: emailHtml,
      });

      this.logger.debug('Gift email sent successfully to:', receiverEmail);
      return { success: true, message: 'Gift email sent successfully' };
    } catch (error) {
      this.logger.error('Error sending gift email:', error);
      throw new BadRequestException(
        `Failed to send gift email: ${error.message}`,
      );
    }
  }
}
