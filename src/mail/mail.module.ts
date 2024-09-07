import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.getOrThrow('MAIL_HOST'),
          port: 2525,
          secure: false,
          auth: {
            user: config.getOrThrow('SMTP_USERNAME'),
            pass: config.getOrThrow('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <manenimabasiudoh@gmil.com>',
        },
       
        preview: false
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
