import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense } from 'src/schema/expenseSchema';

@Injectable()
export class ExpenseService {
    constructor(@InjectModel('Expense') private readonly expenseModel:Model<Expense>){}

    addExpense(amount: number,description: string) {
        console.log( `Expense of ${amount} added with description ${description}`);
        const expense = new this.expenseModel({ amount, description });
        return expense.save();
    }
}
