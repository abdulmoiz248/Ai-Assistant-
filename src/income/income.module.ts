import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IncomeSchema } from 'src/schema/IncomeSchema';

@Module({
  imports:[MongooseModule.forFeature([{name:'Income',schema:IncomeSchema}])],
  exports: [IncomeService],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}
