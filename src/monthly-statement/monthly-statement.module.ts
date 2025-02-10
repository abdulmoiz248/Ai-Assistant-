import { Module } from '@nestjs/common';
import { MonthlyStatementService } from './monthly-statement.service';
import { MonthlyStatementController } from './monthly-statement.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseScehma } from 'src/schema/expenseSchema';
import { IncomeSchema } from 'src/schema/IncomeSchema';

@Module({
  imports:[MongooseModule.forFeature([{name:'Income',schema:IncomeSchema},{name:'Expense',schema:ExpenseScehma}])],
  controllers: [MonthlyStatementController],
  providers: [MonthlyStatementService],
})
export class MonthlyStatementModule {}
