import { Injectable } from '@nestjs/common';

@Injectable()
export class ExpenseService {

    addExpense(amount: number,description: string) {
        console.log( `Expense of ${amount} added with description ${description}`);
    }
}
