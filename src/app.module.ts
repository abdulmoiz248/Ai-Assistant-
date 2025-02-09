import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscordModule } from './discord/discord.module';
import { ConfigModule } from '@nestjs/config';
import { IncomeModule } from './income/income.module';
import { ExpenseModule } from './expense/expense.module';
import { LeetcodeModule } from './leetcode/leetcode.module';
import { LeetCodeService } from './leetcode/leetcode.service';
import { SendMsgModule } from './send-msg/send-msg.module';
import { EventsModule } from './events/events.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GeminiModule } from './gemini/gemini.module';
import { PersonalAssistantModule } from './personal-assistant/personal-assistant.module';


@Module({
  imports: [DiscordModule,ConfigModule.forRoot(), LeetcodeModule,IncomeModule, ExpenseModule, SendMsgModule, EventsModule,ScheduleModule.forRoot(), GeminiModule, PersonalAssistantModule,],
  controllers: [AppController],
  providers: [AppService,LeetCodeService],
})
export class AppModule {
  constructor(private leetCodeService: LeetCodeService) {
    this.leetCodeService.startCronJob();
  }
}

