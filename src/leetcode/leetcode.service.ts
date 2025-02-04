import { Injectable, Logger } from "@nestjs/common"
import axios from "axios"
import * as cron from "node-cron"
import   { SendMsgService } from "src/send-msg/send-msg.service"




@Injectable()
export class LeetCodeService {
  private readonly logger = new Logger(LeetCodeService.name)
  private readonly LEETCODE_API_ENDPOINT = "https://leetcode.com/graphql"

  private readonly cId=process.env.CHANNEL_ID!
  constructor(private sendMsg: SendMsgService) {
    
  }

  async fetchDailyQuestion() {
    try {
      const query = `
        query questionOfToday {
          activeDailyCodingChallengeQuestion {
            date
            link
            question {
              title
              titleSlug
              difficulty
              topicTags {
                name
              }
            }
          }
        }
      `

      const response = await axios.post(this.LEETCODE_API_ENDPOINT, { query })
      return response.data.data.activeDailyCodingChallengeQuestion
    } catch (error) {
      this.logger.error("Failed to fetch LeetCode question", error)
      return null
    }
  }

  startCronJob() {
    
    cron.schedule("00 10 * * *", async () => {
      const questionData = await this.fetchDailyQuestion()

      if (questionData) {
        const formattedMessage = this.formatMessage(questionData)
        this.logger.log("LeetCode question of the day:", formattedMessage)
        try {
         
          await this.sendMsg.sendMessage(this.cId, formattedMessage)
        } catch (error) {
          this.logger.error("Failed to send message", error)
        }
      } else {
        this.logger.error("No question data available.")
      }
    })

    this.logger.log("LeetCode question will be sent daily at 3:53 PM.")
  }

  private formatMessage(questionData: any): string {
    if (!questionData || !questionData.question) {
      return "No question available for today."
    }

    const { date, link, question } = questionData
    const { title, difficulty, topicTags } = question

    return `
**LeetCode Question of the Day (${date}):**
**Title:** ${title}
**Difficulty:** ${difficulty}
**Topics:** ${topicTags.map((tag) => tag.name).join(", ")}
**Link:** https://leetcode.com${link}
    `.trim()
  }
}

