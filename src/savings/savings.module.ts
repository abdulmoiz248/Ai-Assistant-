import { Module } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IncomeSchema } from 'src/schema/IncomeSchema';
import { ExpenseScehma } from 'src/schema/expenseSchema';


@Module({
    imports:[MongooseModule.forFeature([{name:'Income',schema:IncomeSchema},{name:'Expense',schema:ExpenseScehma}])],
  controllers: [SavingsController],
  providers: [SavingsService],
  exports: [SavingsService],
 
})
export class SavingsModule {}
