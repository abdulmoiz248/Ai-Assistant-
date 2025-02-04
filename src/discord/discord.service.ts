import { Injectable } from '@nestjs/common';
import { Client, GatewayIntentBits, TextChannel, Partials, Message,Interaction } from 'discord.js';
import { IncomeService } from 'src/income/income.service';

@Injectable()
export class DiscordService {
  private client: Client;

  constructor(private incomeService: IncomeService) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages, 
      ],
      partials: [Partials.Channel], 
    });
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
    
        await interaction.reply(`Expense of ${amount} added `);
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
      }
     
    });

    await this.client.login(TOKEN);
  }

  async sendMessage(channelId: string, message: string) {
    const channel = await this.client.channels.fetch(channelId);

    if (channel instanceof TextChannel) {
    
      await channel.send(message);
    } else {
      console.error("Channel does not support sending messages");
    }
  }
}
