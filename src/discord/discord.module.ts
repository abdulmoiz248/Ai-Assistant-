import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';
import { IncomeService } from 'src/income/income.service';
import { ExpenseService } from 'src/expense/expense.service';

@Module({
  exports:[DiscordService],
  controllers: [DiscordController],
  providers: [DiscordService,IncomeService,ExpenseService],
  imports: [],
})
export class DiscordModule {}
