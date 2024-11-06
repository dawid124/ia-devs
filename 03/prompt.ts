import {ResponseFormatJSONSchema} from "openai/src/resources/shared";
import OpenAIService, {EModel, openAiResponseType} from "../service/OpenAIService";
import OpenAI from "openai";
import {ChatCompletionMessageParam} from "openai/resources/chat/completions";

export interface IAnswer {
    number: number,
    answer: string;
}

export interface IAnswerList {
    answers: IAnswer[]
}

export interface IQuestionList {
    questions: IQuestion[]
}

export interface IQuestion {
    number: number,
    question: string;
}

export const outputFormat: ResponseFormatJSONSchema = {
    type: 'json_schema',
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
                                "type": "number"
                            },
                            answer: {
                                "type": "string"
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
}

export const askAI = async (text: string, model: EModel, output: openAiResponseType) => {
    return await OpenAIService.completion([
        createSystemPrompt(),
        createMessage(text)
    ], model, false, output) as OpenAI.Chat.Completions.ChatCompletion;
}

const a1: IAnswerList = {
    answers: [
        {
            number: 0,
            answer: "918"
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
            question: "what is color of the see?"
        }
    ]
}
const createSystemPrompt = (): ChatCompletionMessageParam => {
    return {
        role: "system",
        content: `You answer on question, simple, you give the simplest shortest answer
        
        <rules>
        - You always answer in english in JSON format
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