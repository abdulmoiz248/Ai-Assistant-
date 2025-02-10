import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseScehma } from 'src/schema/expenseSchema';

@Module({
  imports:[MongooseModule.forFeature([{name:'Expense',schema: ExpenseScehma}])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
