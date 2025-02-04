import { Injectable } from "@nestjs/common"
import { type Client, TextChannel,ChannelType } from "discord.js"
import { client } from "src/client/client";


@Injectable()
export class SendMsgService {
  private  discordClient: Client
  constructor() {
    this.discordClient=client
  }

  async sendMessage(channelId: string, message: string): Promise<void> {
    try {
      const channel = await this.discordClient.channels.fetch(channelId);
  
      if (!channel) {
        throw new Error(`Channel with ID ${channelId} not found`);
      }
  
      console.log(`Channel type: ${channel.type}`);
  
      if (channel.type === ChannelType.GuildText || channel.type === ChannelType.DM) {
        await channel.send(message);
      } else {
        throw new Error(`The specified channel is not a text or DM channel (type: ${channel.type})`);
      }
    } catch (error) {
      console.error('Failed to send message:', error.message);
      throw error;
    }
  }
}

