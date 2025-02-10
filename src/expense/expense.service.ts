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

    async getAllExpenses(): Promise<string> {
        const exp=await this.expenseModel.find().exec();
        return this.formatExpenses(exp);
    }
    async getThisMonthExpenses(): Promise<string> {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const today = new Date();
        today.setHours(23, 59, 59, 999);  // Ensure it covers the entire current day
      
        const expenses = await this.expenseModel.find({ createdAt: { $gte: startOfMonth, $lte: today } }).exec();
        return this.formatExpenses(expenses);
      }
      
      formatExpenses(expenses: Expense[]): string {
        if (expenses.length === 0) {
          return 'No expenses found for this period.';
        }
      
        let totalAmount = 0;
        let formattedString = '📋 **Expense Report:**\n\n';
      
        expenses.forEach((expense, index) => {
          const date = new Date(expense.createdAt).toLocaleDateString();
          formattedString += `${index + 1}. 📅 Date: ${date}\n   💬 Description: ${expense.description || 'N/A'}\n   💰 Amount: Rs.${expense.amount.toFixed(2)}\n\n`;
          totalAmount += expense.amount;
        });
      
        formattedString += `🔹 **Total Expenses:** Rs.${totalAmount.toFixed(2)}\n`;
        formattedString += `💡 You managed to save a lot this month by tracking your expenses. Keep it up! 🎯`;
      
        return formattedString;
      }
      
      
      
}
