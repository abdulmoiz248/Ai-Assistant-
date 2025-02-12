import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';
import { IncomeModule } from 'src/income/income.module'; // Import IncomeModule
import { ExpenseModule } from 'src/expense/expense.module'; // Import ExpenseModule
import { EventsModule } from 'src/events/events.module';
import { PersonalAssistantService } from 'src/personal-assistant/personal-assistant.service';
import { SendMsgService } from 'src/send-msg/send-msg.service';
import { SavingsModule } from 'src/savings/savings.module';
import { SendEmailModule } from 'src/send-email/send-email.module';


@Module({
  exports: [DiscordService],
  controllers: [DiscordController],
  providers: [DiscordService,PersonalAssistantService,SendMsgService],
  imports: [IncomeModule, ExpenseModule,EventsModule,SavingsModule,SendEmailModule], 
})
export class DiscordModule {}
