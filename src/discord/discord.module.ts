import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';
import { IncomeModule } from 'src/income/income.module'; // Import IncomeModule
import { ExpenseModule } from 'src/expense/expense.module'; // Import ExpenseModule
import { EventsModule } from 'src/events/events.module';

@Module({
  exports: [DiscordService],
  controllers: [DiscordController],
  providers: [DiscordService],
  imports: [IncomeModule, ExpenseModule,EventsModule], 
})
export class DiscordModule {}
