import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventsController } from './events.controller';
import { SendMsgModule } from 'src/send-msg/send-msg.module';

@Module({
  imports:[SendMsgModule],
  controllers: [EventsController],
  providers: [EventService],
  exports:[EventService]
})
export class EventsModule {}
