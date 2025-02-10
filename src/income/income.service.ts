import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Income } from 'src/schema/IncomeSchema';

@Injectable()
export class IncomeService {

    constructor(@InjectModel('Income') private readonly incomeModel:Model<Income>){
      
    }
   async addIncome(amount: number,description: string){
        console.log(amount+" " +description);
        const income = new this.incomeModel({amount,description});
        await income.save();
    }

    async getAllIncome(): Promise<string> {
            const inc=await this.incomeModel.find().exec();
            return this.formatIncome(inc);
        }
        async getThisMonthExpenses(): Promise<string> {
            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const today = new Date();
            today.setHours(23, 59, 59, 999);  // Ensure it covers the entire current day
          
            const expenses = await this.incomeModel.find({ createdAt: { $gte: startOfMonth, $lte: today } }).exec();
            return this.formatIncome(expenses);
          }
          
          formatIncome(expenses: Income[]): string {
            if (expenses.length === 0) {
              return 'No Income found for this period.';
            }
          
            let totalAmount = 0;
            let formattedString = '📋 **Income Report:**\n\n';
          
            expenses.forEach((expense, index) => {
              const date = new Date(expense.createdAt).toLocaleDateString();
              formattedString += `${index + 1}. 📅 Date: ${date}\n   💬 Description: ${expense.description || 'N/A'}\n   💰 Amount: Rs.${expense.amount.toFixed(2)}\n\n`;
              totalAmount += expense.amount;
            });
          
            formattedString += `🔹 **Total Income:** Rs.${totalAmount.toFixed(2)}\n`;
          
            return formattedString;
          }
          
}
