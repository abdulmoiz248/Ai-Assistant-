import { Controller, Get } from '@nestjs/common';
import { MonthlyStatementService } from './monthly-statement.service';

@Controller('monthly-statement')
export class MonthlyStatementController {
  constructor(private readonly monthlyStatementService: MonthlyStatementService) {}

  @Get('generate')
  async generateStatement() {
    await this.monthlyStatementService.generateAndSendMonthlyStatement();
    return { message: 'Monthly statement generated and sent.' };
  }
}