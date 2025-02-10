import * as mongoose from 'mongoose';

export const ExpenseScehma = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    description: { type: String, required: false },
  },
  { timestamps: true }, 
);

// Income TypeScript interface (optional but recommended)
export interface Expense extends mongoose.Document {
  id: string;
  amount: number;
  description: string;
  createdAt: Date;
}
