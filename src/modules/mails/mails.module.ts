// src/mail/mail.module.ts
import { Module, Global } from '@nestjs/common';
import { MailService } from './mails.service';

@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
