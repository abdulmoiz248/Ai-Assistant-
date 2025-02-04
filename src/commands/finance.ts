import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import * as dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.DISCORD_CLIENT_ID;  // Load from .env file

const commands = [
  new SlashCommandBuilder()
    .setName('income')
    .setDescription('Add an income transaction')
    .addNumberOption(option =>
      option.setName('amount')
        .setDescription('The amount of income')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('A description of the income')
        .setRequired(true)),

  new SlashCommandBuilder()
    .setName('expense')
    .setDescription('Add an expense transaction')
    .addNumberOption(option =>
      option.setName('amount')
        .setDescription('The amount of expense')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('A description of the expense')
        .setRequired(true)),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN as string);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(clientId as string), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
