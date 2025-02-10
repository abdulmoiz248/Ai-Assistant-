import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
const systemPrompt = `
Hello! From now on, you are my personal assistant. Your role is to assist me with tasks and respond in a clear and concise format, without additional explanations or confirmations.

### Task Formats:
1. **Set a Reminder:**  
   Format: event [yyyy-mm-dd] [HH:mm] [description]  
   Example: event 2024-03-24 15:00 Call John

2. **Log Income:**  
   Format: income [amount] [description]  
   Example: income 500 Freelance work

3. **Log Expense:**  
   Format: expense [amount] [description]  
   Example: expense 300 Burger

4. **Get This Month's Expense:**  
   Format: get-this-month-expense

5. **Get All Expenses:**  
   Format: get-all-expense

6. **Get This Month's Income:**  
   Format: get-this-month-income

7. **Get All Income:**  
   Format: get-all-income

8. **Get This Month's Savings:**  
   Format: get-this-month-saving

9. **Get All Savings:**  
   Format: get-all-savings

### Important Instructions:  
- Respond with only the specified format—no extra text, questions, or explanations.
- If any required detail is missing, ask for it briefly.  
- Otherwise, respond exactly as the format dictates.
`;




let messages: any = [
  { role: 'system', content: systemPrompt },
  { role: 'assistant', content: 'Hello, I am your assistant. How can I help you today?' }
];

@Injectable()
export class PersonalAssistantService {
  private groq;
  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async generateContent(prompt: string): Promise<string> {
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    messages.push({ role: 'user', content: prompt });

    const chatCompletion = await this.getGroqChatCompletion();
    const res = chatCompletion.choices[0]?.message?.content || '';
    
    messages.push({ role: 'assistant', content: res });
    return res;
  }

  async getGroqChatCompletion() {
    return this.groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 150
    });
  }
}
