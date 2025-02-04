import { Module } from '@nestjs/common';
import { SendMsgService } from './send-msg.service';
import { SendMsgController } from './send-msg.controller';

@Module({
  controllers: [SendMsgController],
  providers: [SendMsgService],
  exports: [SendMsgService],
})
export class SendMsgModule {}
