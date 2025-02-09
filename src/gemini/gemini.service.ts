import { Injectable } from '@nestjs/common';

const { GoogleGenerativeAI } = require("@google/generative-ai");


@Injectable()
export class GeminiService {
   private model;
    constructor(){
       const apikey=process.env.GEMINI_API_KEY;
       const genAI = new GoogleGenerativeAI(apikey);
       this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    }

async generateGeminiContent(prompt: string): Promise<string> {
    if (!prompt) {
        throw new Error("Prompt is required");
    }

  
    const result = await this.model.generateContent(prompt);
    return result.response.text()

}
}
