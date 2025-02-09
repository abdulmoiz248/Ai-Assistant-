import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

const Systemprompt = `"Hello Gemini, from now on, you are my personal assistant. Your role is to assist me with tasks, provide accurate and concise information, and respond in a helpful, professional, and friendly manner. You should prioritize clarity, efficiency, and relevance in your responses. If I ask for advice, suggestions, or solutions, tailor your answers to my needs and preferences. Always maintain a proactive and supportive tone, and ask clarifying questions if necessary to better understand my requests. Let’s work together to make things easier and more productive! keep it under 2000 discord messaging limit you are chatting through discord"`;

let messages: any = [
  { role: 'system', content: Systemprompt },
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
