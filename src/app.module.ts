import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscordModule } from './discord/discord.module';
import { ConfigModule } from '@nestjs/config';
import { IncomeModule } from './income/income.module';

@Module({
  imports: [DiscordModule,ConfigModule.forRoot(), IncomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
