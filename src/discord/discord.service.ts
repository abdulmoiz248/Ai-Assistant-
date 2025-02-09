import { Injectable } from '@nestjs/common';
import { IncomeService } from 'src/income/income.service';
import { ExpenseService } from 'src/expense/expense.service'
import { client } from 'src/client/client';

import { Client,  Message,Interaction } from 'discord.js';
import { EventService } from 'src/events/events.service';
import { SendMsgService } from 'src/send-msg/send-msg.service';
import {PersonalAssistantService} from 'src/personal-assistant/personal-assistant.service';
@Injectable()
export class DiscordService {
  private client:Client;

  private cId;
  constructor(private sendMsg:SendMsgService,private PersonalAssistantService:PersonalAssistantService,private incomeService: IncomeService,private expenseService: ExpenseService,private eventService:EventService) {
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

      if (message.guild === null) { // DM check
        console.log('Received DM:', message.content);   
        const msg=  await this.PersonalAssistantService.generateContent(message.content);
        
        await this.sendMsg.sendMessage(this.cId,msg);
         
      }
     
    });

    await this.client.login(TOKEN);
  }

  
}
