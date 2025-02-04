import { Module } from '@nestjs/common';
import { LeetCodeService } from './leetcode.service';
import { LeetcodeController } from './leetcode.controller';
import { SendMsgService } from 'src/send-msg/send-msg.service';
import { SendMsgModule } from 'src/send-msg/send-msg.module';
@Module({
  
  imports: [SendMsgModule],
  controllers: [LeetcodeController],
  providers: [LeetCodeService],
})
export class LeetcodeModule {}
