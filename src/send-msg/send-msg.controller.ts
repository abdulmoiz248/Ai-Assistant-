import { Controller } from '@nestjs/common';
import { SendMsgService } from './send-msg.service';

@Controller('send-msg')
export class SendMsgController {
  constructor(private readonly sendMsgService: SendMsgService) {}
}
