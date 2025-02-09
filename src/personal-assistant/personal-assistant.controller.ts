import { Controller } from '@nestjs/common';
import { PersonalAssistantService } from './personal-assistant.service';

@Controller('personal-assistant')
export class PersonalAssistantController {
  constructor(private readonly personalAssistantService: PersonalAssistantService) {}
}
