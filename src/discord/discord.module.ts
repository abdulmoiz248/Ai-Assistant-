import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';
import { IncomeModule } from 'src/income/income.module'; // Import IncomeModule
import { ExpenseModule } from 'src/expense/expense.module'; // Import ExpenseModule
import { EventsModule } from 'src/events/events.module';
import { PersonalAssistantService } from 'src/personal-assistant/personal-assistant.service';
import { SendMsgService } from 'src/send-msg/send-msg.service';


@Module({
  exports: [DiscordService],
  controllers: [DiscordController],
  providers: [DiscordService,PersonalAssistantService,SendMsgService],
  imports: [IncomeModule, ExpenseModule,EventsModule], 
})
export class DiscordModule {}
