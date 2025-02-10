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
}
