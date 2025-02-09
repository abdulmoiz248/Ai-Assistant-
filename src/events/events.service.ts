import { Injectable } from "@nestjs/common"
import  { SchedulerRegistry } from "@nestjs/schedule"
import { SendMsgService } from "src/send-msg/send-msg.service";


@Injectable()
export class EventService {
  private cID;
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private sendMsg:SendMsgService
  ) {
    this.cID = process.env.CHANNEL_ID
  }

  async createEvent(eventData: { date: string; description: string; time: string }) {
    const { date, description, time } = eventData
    const eventDate = new Date(`${date}T${time}`)

    const job = setTimeout(async () => {
      await this.sendMsg.sendMessage(this.cID,`Reminder  : ${description} `)
    }, eventDate.getTime() - Date.now())

    this.schedulerRegistry.addTimeout(`event_${Date.now()}`, job)

    return { message: "Event created successfully" }
  }
}

