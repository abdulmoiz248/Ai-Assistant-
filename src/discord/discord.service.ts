import { Injectable } from '@nestjs/common';
import { IncomeService } from 'src/income/income.service';
import { ExpenseService } from 'src/expense/expense.service'
import { client } from 'src/client/client';

import { Client,  Message,Interaction } from 'discord.js';
import { EventService } from 'src/events/events.service';
import { SendMsgService } from 'src/send-msg/send-msg.service';
import {PersonalAssistantService} from 'src/personal-assistant/personal-assistant.service';
import { SavingsService } from 'src/savings/savings.service';
@Injectable()
export class DiscordService {
  private client:Client;

  private cId;
  constructor(private savingService:SavingsService,private sendMsg:SendMsgService,private PersonalAssistantService:PersonalAssistantService,private incomeService: IncomeService,private expenseService: ExpenseService,private eventService:EventService) {
    this.client=client;
    this.cId = process.env.CHANNEL_ID;
  }

  async onModuleInit() {
    const TOKEN = process.env.DISCORD_BOT_TOKEN;

    this.client.once('ready', () => {
      console.log(`🤖 Discord Bot is online as ${this.client.user?.tag}`);
    });
    this.client.on('interactionCreate', async (interaction: Interaction) => {
      if (!interaction.isCommand()) return;

      const { commandName } = interaction;

      if (commandName === 'income') {
      
        const amount = interaction.options.get('amount')?.value as number;
        const description = interaction.options.get('description')?.value as string;
        
        
          this.incomeService.addIncome(amount,description);
          await interaction.reply(`Income of ${amount} added successfully `);
      }

      if (commandName === 'expense') {
      
        const amount = interaction.options.get('amount')?.value as number;
        const description = interaction.options.get('description')?.value as string;
        this.expenseService.addExpense(amount,description);
    
        await interaction.reply(`Expense of ${amount} added `);
      }

      if(commandName==='event'){
        const date = interaction.options.get('date')?.value as string;
        const time = interaction.options.get('time')?.value as string;
        const description = interaction.options.get('description')?.value as string;
        this.eventService.createEvent({date,description,time});
        await interaction.reply(`Event created successfully`);
      }
    });

   
    this.client.on('messageCreate', async (message: Message) => {
      if (message.author.bot) return;

     
      if (message.partial) {
        try {
          await message.fetch(); 
        } catch (error) {
          console.error('Failed to fetch message:', error);
          return;
        }
      }

      if (message.guild === null) { 
        console.log('Received DM:', message.content);   
        const msg=  await this.PersonalAssistantService.generateContent(message.content);
        if (msg.toLowerCase().startsWith("event") || msg.toLowerCase().startsWith(`"event`) || msg.toLowerCase().startsWith(`'event`)) {  
          this.extractReminderDetails(msg)
          return;
         }else if (msg.toLowerCase().startsWith("income") || msg.toLowerCase().startsWith(`"income`) || msg.toLowerCase().startsWith(`'income`)) {  
          this.extractIncomeDetails(msg)
          return;
         }else if (msg.toLowerCase().startsWith("expense") || msg.toLowerCase().startsWith(`"expense`) || msg.toLowerCase().startsWith(`'expense`)) {  
          this.extractExpenseDetails(msg)
          return;
         }else if(msg.toLowerCase().startsWith("get-this-month-expense")){
          const res=await this.expenseService.getThisMonthExpenses()
          await this.sendMsg.sendMessage(this.cId,res); 
         }else if(msg.toLowerCase().startsWith("get-this-month-income")){
          const res=await this.incomeService.getThisMonthExpenses();
          await this.sendMsg.sendMessage(this.cId,res);
         }else if(msg.toLowerCase().startsWith("get-all-expense")){
          const res=await this.expenseService.getAllExpenses();
          await this.sendMsg.sendMessage(this.cId,res);
         }else if(msg.toLowerCase().startsWith("get-all-income")){
               const res=await this.incomeService.getAllIncome();
                await this.sendMsg.sendMessage(this.cId,res);

         }else if(msg.toLowerCase().startsWith("get-this-month-saving")){
          const res=await this.savingService.getThisMonthSaving();
           await this.sendMsg.sendMessage(this.cId,res);

         }else if(msg.toLowerCase().startsWith("get-all-savings")){
      const res=await this.savingService.getAllSavings();
       await this.sendMsg.sendMessage(this.cId,res);

       }
         else
        await this.sendMsg.sendMessage(this.cId,msg);
         
      }
     
    });

    await this.client.login(TOKEN);
  }


 async extractReminderDetails(message:string) {
   
  

   
    const parts = message.split(/\s+/); 
    if (parts.length < 4) {
        return false; 
    }

    // Extract date, time, and description
    let date = parts[1]; 
    const time = parts[2]; 
    const description = parts.slice(3).join(" ");
   

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if(date.includes('today')) 
{
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();
  date = `${yyyy}-${mm}-${dd}`;
}
    else if (!dateRegex.test(date)) {
        return false; 
    }

    // Validate time format (24-hour format)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
        return false; 
    }
    console.log("time",time);
    console.log("description",description);
    console.log("date",date);



    await this.eventService.createEvent({date,description,time});
    await this.sendMsg.sendMessage(this.cId,`Event ${description} created Successfully`);
    return true;
}

async extractIncomeDetails(message:string) {
  const parts = message.split(/\s+/);
  if (parts.length < 3) {
      return "Invalid format. Please provide the income in the format: `income [amount] [description]`.";
  }

  const amount = parseFloat(parts[1]);
  if (isNaN(amount)) {
      return "Invalid amount. Please provide a numeric value for the income.";
  }

  const description = parts.slice(2).join(" ");
  this.incomeService.addIncome(amount,description);
  await this.sendMsg.sendMessage(this.cId, `Income of ${amount} added successfully for ${description}.`);
 
}


 async extractExpenseDetails(message:string) {
  const parts = message.split(/\s+/); // Split by whitespace
  if (parts.length < 3) {
      return "Invalid format. Please provide the expense in the format: `expense [amount] [description]`.";
  }

  const amount = parseFloat(parts[1]);
  if (isNaN(amount)) {
      return "Invalid amount. Please provide a numeric value for the expense.";
  }

  const description = parts.slice(2).join(" ");
  this.expenseService.addExpense(amount,description);
  await this.sendMsg.sendMessage(this.cId, `Expense of ${amount} added successfully for ${description}.`);
  
}
  

}
