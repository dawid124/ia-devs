import OpenAI from "openai";
require('dotenv').config({ path: '../.env' })
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import * as Shared from "openai/src/resources/shared";

export enum EModel {
  gpt4 = 'gpt-4',
  gpt4o = 'gpt-4o',
  gpt4oMini = 'gpt-4o-mini',
  gpt35turbo = 'gpt-3.5-turbo',
}

export type openAiResponseType = Shared.ResponseFormatText
    | Shared.ResponseFormatJSONObject
    | Shared.ResponseFormatJSONSchema;

class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI();
  }

  async completion(
    messages: ChatCompletionMessageParam[],
    model: string = "gpt-4",
    stream: boolean = false,
    responseType: openAiResponseType = {type: 'text'},
  ): Promise<OpenAI.Chat.Completions.ChatCompletion | AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    try {
      const chatCompletion = await this.openai.chat.completions.create({
        messages,
        model,
        stream,
        response_format: responseType,
      });

      if (stream) {
        return chatCompletion as AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
      } else {
        return chatCompletion as OpenAI.Chat.Completions.ChatCompletion;
      }
    } catch (error) {
      console.error("Error in OpenAI completion:", error);
      throw error;
    }
  }
}

export default new OpenAIService();