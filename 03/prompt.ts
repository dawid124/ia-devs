import OpenAIService, {EModel, openAiResponseType} from "../service/OpenAIService";
import {ChatCompletionMessageParam} from "openai/resources/chat/completions";
import {IAnswerList, IQuestionList} from "./types";
import OpenAI from "openai";

const a1: IAnswerList = {
    answers: [
        {
            number: 0,
            answer: "1918"
        },
        {
            number: 1,
            answer: "blue"
        }
    ]
}

const q1: IQuestionList = {
    questions: [
        {
            number: 0,
            question: "the year of Poland regaining independence"
        },
        {
            number: 1,
            question: "what is color of the sea?"
        }
    ]
}

export const outputFormat = {
    type: 'json_schema' as const,
    json_schema: {
        name: 'answers',
        strict: true,
        schema: {
            type: "object",
            properties: {
                answers: {
                    type: 'array',
                    items: {
                        type: "object",
                        properties: {
                            number: {
                                type: "number"
                            },
                            answer: {
                                type: "string"
                            }
                        },
                        required: ["number", "answer"],
                        additionalProperties: false
                    }
                }
            },
            required: ["answers"],
            additionalProperties: false
        }
    }
} as const;

export const askAI = async (text: string, model: EModel, output: openAiResponseType) => {
    return await OpenAIService.completion([
        createSystemPrompt(),
        createMessage(text)
    ], model, false, output) as OpenAI.Chat.Completions.ChatCompletion;
}

const createSystemPrompt = (): ChatCompletionMessageParam => {
    return {
        role: "system",
        content: `You answer questions simply and provide the shortest possible answer
        
        <rules>
        - Always answer in English in JSON format
        </rules>
        
        <snippet_examples>
        USER: ${JSON.stringify(q1)}
        AI: ${JSON.stringify(a1)}
        </snippet_examples>
        `
    };
};

const createMessage = (question: string): ChatCompletionMessageParam => {
    return { content: question, role: "user" }
}