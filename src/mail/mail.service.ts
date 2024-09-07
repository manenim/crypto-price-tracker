import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(
    private mailerService: MailerService
    ) { }

    public async sendEmail(to: string, subject: string, text: string): Promise<void> {
        await this.mailerService.sendMail({
            to,
            subject,
            text
        });
    }
}
