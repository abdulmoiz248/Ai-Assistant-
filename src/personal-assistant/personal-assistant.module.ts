import { Module } from '@nestjs/common';
import { PersonalAssistantService } from './personal-assistant.service';
import { PersonalAssistantController } from './personal-assistant.controller';

@Module({
  exports: [PersonalAssistantService],
  controllers: [PersonalAssistantController],
  providers: [PersonalAssistantService],
})
export class PersonalAssistantModule {}
