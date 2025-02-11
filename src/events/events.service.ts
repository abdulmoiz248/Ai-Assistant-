import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { SendMsgService } from "src/send-msg/send-msg.service";

@Injectable()
export class EventService {
  private cID: string;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private sendMsg: SendMsgService
  ) {
    this.cID = process.env.CHANNEL_ID!;
  }

  async createEvent(eventData: { date: string; description: string; time: string }) {
    const { date, description, time } = eventData;
 
    const eventDate = new Date(`${date}T${time}`);
    
    if (eventDate.getTime() <= Date.now()) {
      throw new Error("Event time must be in the future.");
    }

    const job = setTimeout(async () => {
      await this.sendMsg.sendMessage(this.cID, `Reminder: ${description}`);
    }, eventDate.getTime() - Date.now());

    this.schedulerRegistry.addTimeout(`event_${Date.now()}`, job);

    return { message: "Event created successfully" };
  }

  async createEventFromSec(description: string, sec:  number) {
    const seconds = sec;
    if (isNaN(seconds) || seconds <= 0) {
      console.log(sec)
      return "Invalid seconds value. Please provide a positive number.";
    }
    
    const time = this.getTimeAfterSeconds(seconds);
    const date = new Date().toISOString().split("T")[0];
    await this.createEvent({ date, description, time });
    return `Event set for ${time}`;
  }
  

  private getTimeAfterSeconds(seconds: number): string {
    const futureTime = new Date(Date.now() + seconds * 1000);
    const hours = futureTime.getHours().toString().padStart(2, "0");
    const minutes = futureTime.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
}
