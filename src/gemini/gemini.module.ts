import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';

@Module({
  exports:[GeminiService]
,  controllers: [GeminiController],
  providers: [GeminiService],
})
export class GeminiModule {}
