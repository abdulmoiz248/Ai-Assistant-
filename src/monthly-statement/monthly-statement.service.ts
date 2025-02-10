import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { createTransport } from 'nodemailer';
import * as PDFDocument from 'pdfkit';
import { Income } from '../schema/IncomeSchema';
import { Expense } from '../schema/expenseSchema';

@Injectable()
export class MonthlyStatementService {
  constructor(
    @InjectModel('Income') private incomeModel: Model<Income>,
    @InjectModel('Expense') private expenseModel: Model<Expense>,
  ) {}

  @Cron('0 0 1 * *') // Run at 00:00 on day-of-month 1
  async generateAndSendMonthlyStatement() {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const endOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0, 23, 59, 59);
    

  //  console.log('Generating monthly statement for', startOfLastMonth, 'to', endOfLastMonth);
    const incomes = await this.incomeModel.find({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });
    
    const expenses = await this.expenseModel.find({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    });
    

    // console.log('Incomes:', incomes);
    // console.log('Expenses:', expenses);

    const pdfBuffer = await this.generatePDF(incomes, expenses);
    await this.sendEmail(pdfBuffer);
  }

  private async generatePDF(incomes: Income[], expenses: Expense[]): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];
  
      doc.on('data', (chunk: never) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
  
      // Title
      doc
        .fontSize(20)
        .text('Monthly Financial Statement', { align: 'center' })
        .moveDown(1);
  
      doc
        .fontSize(12)
        .text(`Date: ${new Date().toISOString().split('T')[0]}`, { align: 'right' })
        .moveDown(1);
  
      // Table Header
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Date', 50, 150)
        .text('Description', 150, 150)
        .text('Expenses', 380, 150, { width: 90, align: 'right' })
        .text('Income', 470, 150, { width: 90, align: 'right' });
  
      doc.moveTo(50, 170).lineTo(550, 170).stroke(); // Header underline
  
      let y = 180;
      let totalIncome = 0;
      let totalExpenses = 0;
      const itemsPerPage = 20;
      let itemCount = 0;
  
      const generateTableContent = (items: any[], isExpense: boolean) => {
        items.forEach((item) => {
          if (itemCount > 0 && itemCount % itemsPerPage === 0) {
            doc.addPage();
            y = 50;
          }
  
          doc
            .fontSize(10)
            .text(new Date(item.createdAt).toISOString().split('T')[0], 50, y)
            .text(item.description || 'N/A', 150, y)
            .text(isExpense ? item.amount.toFixed(2) : '', 380, y, { width: 90, align: 'right' })
            .text(!isExpense ? item.amount.toFixed(2) : '', 470, y, { width: 90, align: 'right' });
  
          if (isExpense) {
            totalExpenses += item.amount;
          } else {
            totalIncome += item.amount;
          }
  
          y += 20;
          itemCount++;
        });
      };
  
      // Generate table content
      generateTableContent(incomes, false); // Income entries
      generateTableContent(expenses, true); // Expense entries
  
      doc.moveDown(2);
      doc.moveTo(50, y).lineTo(550, y).stroke(); // Line before total summary
  
      // Summary
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Total Income:', 50, y + 10)
        .text(totalIncome.toFixed(2), 470, y + 10, { width: 90, align: 'right' });
  
      doc
        .fontSize(12)
        .text('Total Expenses:', 50, y + 30)
        .text(totalExpenses.toFixed(2), 470, y + 30, { width: 90, align: 'right' });
  
      const savings = totalIncome - totalExpenses;
  
      doc
        .fontSize(12)
        .text('Net Savings:', 50, y + 50)
        .text(savings.toFixed(2), 470, y + 50, { width: 90, align: 'right' });
  
      doc.moveDown(2);
  
      // Add a motivational message at the end
      doc
        .fontSize(14)
        .font('Helvetica-Oblique')
        .fillColor(savings > 0 ? 'green' : 'red')
        .text(
          savings > 0
            ? `Great job! You saved ${savings.toFixed(2)} this month!`
            : `Be cautious! You overspent by ${Math.abs(savings).toFixed(2)} this month.`,
          { align: 'center' }
        );
  
      doc.end();
    });
  }
   
  private generateTableRow(doc: PDFKit.PDFDocument, y: number, date: string, description: string, debit: string, credit: string) {
    doc
      .fontSize(10)
      .text(date, 50, y)
      .text(description, 150, y)
      .text(debit, 380, y, { width: 90, align: 'right' })
      .text(credit, 470, y, { width: 90, align: 'right' });
  }

  private async sendEmail(pdfBuffer: Buffer) {
    const transporter = createTransport({
      // Configure your email service here
      host:'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
    });

    await transporter.sendMail({
      from: 'your-email@example.com',
      to: 'moiz20920@gmail.com',
      subject: 'Monthly Statement',
      text: 'Please find attached your monthly statement.',
      attachments: [
        {
          filename: 'monthly-statement.pdf',
          content: pdfBuffer,
        },
      ],
    });
  }
}