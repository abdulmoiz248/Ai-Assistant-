import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { GeminiService } from 'src/gemini/gemini.service';
import { SendMsgService } from 'src/send-msg/send-msg.service';
import { GeminiModule } from 'src/gemini/gemini.module';
import { SendMsgModule } from 'src/send-msg/send-msg.module';

@Module({
  imports:[GeminiModule,SendMsgModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
