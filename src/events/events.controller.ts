import { Controller } from '@nestjs/common';
import { EventService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventService) {}
}
