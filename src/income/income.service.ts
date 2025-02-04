import { Injectable } from '@nestjs/common';

@Injectable()
export class IncomeService {
    addIncome(amount: number,description: string){
        console.log(amount+" " +description);
    }
}
