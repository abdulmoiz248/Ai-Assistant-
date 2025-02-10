import { Injectable } from '@nestjs/common';
import { Income } from '../schema/IncomeSchema';
import { Expense } from '../schema/expenseSchema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class SavingsService  {
      constructor(
        @InjectModel('Income') private incomeModel: Model<Income>,
        @InjectModel('Expense') private expenseModel: Model<Expense>,
      ) {}
  
    async getThisMonthSaving(): Promise<string> {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
  
      const incomes = await this.incomeModel.find({ createdAt: { $gte: startOfMonth, $lt: today } }).exec();
      const expenses = await this.expenseModel.find({ createdAt: { $gte: startOfMonth, $lt: today } }).exec();
  
      const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
      const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const savings = totalIncome - totalExpense;
  
      return this.formatSavings(savings, totalIncome, totalExpense, "this month");
    }
  
    async getAllSavings(): Promise<string> {
      const incomes = await this.incomeModel.find().exec();
      const expenses = await this.expenseModel.find().exec();
  
      const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
      const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const savings = totalIncome - totalExpense;
  
      return this.formatSavings(savings, totalIncome, totalExpense, "all time");
    }
  
    private formatSavings(savings: number, totalIncome: number, totalExpense: number, period: string): string {
      let formattedString = `📊 **Savings Report (${period}):**\n\n`;
      formattedString += `💰 **Total Income:** Rs.${totalIncome.toFixed(2)}\n`;
      formattedString += `💸 **Total Expenses:** Rs.${totalExpense.toFixed(2)}\n`;
      formattedString += `🔹 **Total Savings:** Rs.${savings.toFixed(2)}\n\n`;
  
      if (savings > 0) {
        formattedString += `🎉 Great job! You saved $${savings.toFixed(2)} ${period}. Keep up the good work! 🚀`;
      } else if (savings === 0) {
        formattedString += `🤔 You broke even ${period}. Consider reviewing your spending habits.`;
      } else {
        formattedString += `⚠️ Oops! You overspent by $${Math.abs(savings).toFixed(2)} ${period}. Time to rethink your budget! 📉`;
      }
  
      return formattedString;
    }
  }
  
