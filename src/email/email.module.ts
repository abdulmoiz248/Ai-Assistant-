import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { GeminiService } from 'src/gemini/gemini.service';
import { SendMsgService } from 'src/send-msg/send-msg.service';

@Module({
  controllers: [EmailController],
  providers: [EmailService,GeminiService,SendMsgService],
})
export class EmailModule {}
