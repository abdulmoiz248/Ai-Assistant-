import { Module } from '@nestjs/common';
import { SendEmailService } from './send-email.service';
import { SendEmailController } from './send-email.controller';

@Module({
  exports: [SendEmailService],
  controllers: [SendEmailController],
  providers: [SendEmailService],
})
export class SendEmailModule {}
