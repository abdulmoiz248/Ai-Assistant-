import { Module } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';
import { IncomeService } from 'src/income/income.service';

@Module({
  exports:[DiscordService],
  controllers: [DiscordController],
  providers: [DiscordService,IncomeService],
  imports: [],
})
export class DiscordModule {}
