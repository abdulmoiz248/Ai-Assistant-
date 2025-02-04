import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';
import { IncomeModule } from 'src/income/income.module'; // Import IncomeModule
import { ExpenseModule } from 'src/expense/expense.module'; // Import ExpenseModule

@Module({
  exports: [DiscordService],
  controllers: [DiscordController],
  providers: [DiscordService],
  imports: [IncomeModule, ExpenseModule], 
})
export class DiscordModule {}
