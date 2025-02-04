import { Injectable } from '@nestjs/common';
import { Client, GatewayIntentBits, TextChannel, Partials, Message } from 'discord.js';

@Injectable()
export class DiscordService {
  private client: Client;

  constructor() {
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

   
    this.client.on('messageCreate', async (message: Message) => {
      if (message.author.bot) return;

     
      if (message.partial) {
        try {
          await message.fetch(); // Fetch the full message
        } catch (error) {
          console.error('Failed to fetch message:', error);
          return;
        }
      }

      if (message.guild === null) { // DM check
        console.log('Received DM:', message.content); // Log DM content for debugging

        if (message.content.toLowerCase() === 'hello') {
          await message.reply('Hello! How can I assist you? 🤖');
        }else {
            await message.reply('I only understand "hello" for now. 🤖');
        }
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
