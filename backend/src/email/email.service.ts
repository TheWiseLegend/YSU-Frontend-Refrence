import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(private config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
    this.fromEmail = this.config.get<string>('RESEND_FROM_EMAIL') ?? 'noreply@ysumalaysia.org';
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const { error } = await this.resend.emails.send({
        from: `الاتحاد العام للطلاب اليمنيين في ماليزيا <${this.fromEmail}>`,
        to,
        subject,
        html,
      });

      if (error) {
        this.logger.error(`Resend error: ${JSON.stringify(error)}`);
        return false;
      }

      this.logger.log(`Email sent successfully to: ${to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      return false;
    }
  }

  private baseTemplate(content: string): string {
    return `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f4f4; padding: 24px;">
        <div style="background-color: #2E3F6E; padding: 20px 24px; border-radius: 8px 8px 0 0; text-align: right;">
          <h1 style="color: #ffffff; margin: 0; font-size: 17px; font-weight: 500;">الاتحاد العام للطلاب اليمنيين في ماليزيا</h1>
          <p style="color: #a8b8d8; margin: 4px 0 0; font-size: 12px;">noreply@ysumalaysia.org</p>
        </div>
        <div style="background-color: #ffffff; padding: 28px 24px; border-radius: 0 0 8px 8px;">
          ${content}
          <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />
          <p style="font-size: 13px; color: #666666; margin: 0;">مع تحيات،<br/><strong>الاتحاد العام للطلاب اليمنيين في ماليزيا</strong></p>
        </div>
        <div style="padding: 12px 24px; text-align: right;">
          <p style="font-size: 11px; color: #999999; margin: 0;">هذه رسالة تلقائية، الرجاء عدم الرد عليها مباشرة.</p>
        </div>
      </div>
    `;
  }

  async sendReceiptEmail(params: {
    toEmail: string;
    fullNameAr: string;
    membershipId: string;
  }): Promise<boolean> {
    const subject = 'تم استلام طلب العضوية - الاتحاد العام للطلاب اليمنيين';
    const content = `
      <h2 style="color: #2E3F6E; font-size: 18px; font-weight: 500; margin: 0 0 12px;">تم استلام طلبك</h2>
      <p style="color: #444444; font-size: 15px; line-height: 1.7; margin: 0 0 12px;">
        عزيزي/عزيزتي <strong>${params.fullNameAr}</strong>،
      </p>
      <p style="color: #444444; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
        تم استلام طلب العضوية الخاص بك بنجاح وهو الآن قيد المراجعة من قِبل الإدارة.
      </p>
      <div style="background-color: #EEF2FF; border-right: 3px solid #2E3F6E; padding: 14px 16px; margin: 0 0 16px;">
        <p style="margin: 0 0 6px; font-size: 13px; color: #2E3F6E;">رقم الطلب: <strong>${params.membershipId}</strong></p>
        <p style="margin: 0; font-size: 13px;">
          الحالة: <span style="background-color: #FEF3C7; color: #92400E; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 20px;">قيد المراجعة</span>
        </p>
      </div>
      <p style="color: #444444; font-size: 15px; line-height: 1.7; margin: 0;">
        سيتم إشعارك بنتيجة مراجعة طلبك في أقرب وقت ممكن.
      </p>
    `;
    return this.sendEmail(params.toEmail, subject, this.baseTemplate(content));
  }

  async sendApprovalEmail(params: {
    toEmail: string;
    fullNameAr: string;
    membershipId: string;
    expiresAt: string;
  }): Promise<boolean> {
    const subject = 'تهانينا! تم قبول طلب عضويتك - الاتحاد العام للطلاب اليمنيين';
    const content = `
      <h2 style="color: #4A7C4E; font-size: 18px; font-weight: 500; margin: 0 0 12px;">تهانينا! تمت الموافقة على عضويتك</h2>
      <p style="color: #444444; font-size: 15px; line-height: 1.7; margin: 0 0 12px;">
        عزيزي/عزيزتي <strong>${params.fullNameAr}</strong>،
      </p>
      <p style="color: #444444; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
        يسعدنا إبلاغك بأنه تمت الموافقة على طلب عضويتك في الاتحاد العام للطلاب اليمنيين في ماليزيا.
      </p>
      <div style="background-color: #EFF7EF; border-right: 3px solid #4A7C4E; padding: 14px 16px; margin: 0 0 16px;">
        <p style="margin: 0 0 6px; font-size: 13px; color: #2E5C31;">رقم العضوية: <strong>${params.membershipId}</strong></p>
        <p style="margin: 0 0 6px; font-size: 13px;">
          الحالة: <span style="background-color: #D1FAE5; color: #065F46; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 20px;">عضوية نشطة</span>
        </p>
        <p style="margin: 0; font-size: 13px; color: #2E5C31;">تاريخ الانتهاء: <strong>${params.expiresAt}</strong></p>
      </div>
      <p style="color: #444444; font-size: 15px; line-height: 1.7; margin: 0;">
        يمكنك الآن تسجيل الدخول والاستفادة من جميع مزايا العضوية وعروض الخصومات لدى الشركاء.
      </p>
    `;
    return this.sendEmail(params.toEmail, subject, this.baseTemplate(content));
  }

  async sendRejectionEmail(params: {
    toEmail: string;
    fullNameAr: string;
    membershipId: string;
    reason: string;
  }): Promise<boolean> {
    const subject = 'بخصوص طلب عضويتك - الاتحاد العام للطلاب اليمنيين';
    const content = `
      <h2 style="color: #C0392B; font-size: 18px; font-weight: 500; margin: 0 0 12px;">بخصوص طلب عضويتك</h2>
      <p style="color: #444444; font-size: 15px; line-height: 1.7; margin: 0 0 12px;">
        عزيزي/عزيزتي <strong>${params.fullNameAr}</strong>،
      </p>
      <p style="color: #444444; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
        نأسف لإبلاغك بأنه لم يتم قبول طلب عضويتك في الوقت الحالي.
      </p>
      <div style="background-color: #FDF0EE; border-right: 3px solid #C0392B; padding: 14px 16px; margin: 0 0 16px;">
        <p style="margin: 0 0 6px; font-size: 13px; color: #8B2219;">رقم الطلب: <strong>${params.membershipId}</strong></p>
        <p style="margin: 0 0 6px; font-size: 13px;">
          الحالة: <span style="background-color: #FEE2E2; color: #991B1B; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 20px;">مرفوض</span>
        </p>
        <p style="margin: 0; font-size: 13px; color: #8B2219;">سبب الرفض: <strong>${params.reason}</strong></p>
      </div>
      <p style="color: #444444; font-size: 15px; line-height: 1.7; margin: 0;">
        يمكنك التواصل مع الإدارة للمزيد من التوضيح أو إعادة التقديم بعد تصحيح المعلومات المطلوبة.
      </p>
    `;
    return this.sendEmail(params.toEmail, subject, this.baseTemplate(content));
  }
}
