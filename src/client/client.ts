
import { Client, GatewayIntentBits, TextChannel, Partials, Message,Interaction } from 'discord.js';

export const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages, 
    ],
    partials: [Partials.Channel], 
  });
  