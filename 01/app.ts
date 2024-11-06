import OpenAIService from '../service/OpenAIService';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { Request, Response } from 'express';

const express = require('express');
const cheerio = require('cheerio');
require('dotenv').config({ path: '../.env' });

const app = express();
const port = 3000;

app.get('/', async (req: Request, res: Response) => {
    if (!process.env.AI_DEVS_KEY || !process.env.XYZ_PAGE_USERNAME || !process.env.XYZ_PAGE_PASSWORD) {
        throw new Error('AI_DEVS_KEY or XYZ_PAGE_USERNAME or XYZ_PAGE_PASSWORD is not defined');
    }

    const resp = await fetch(process.env.XYZ_API as string);

    if (!resp.ok) {
        throw new Error(`Fetch Response status: ${resp.status}`);
    }

    const content = await resp.text();
    const html = cheerio.load(content);
    const question = html('#human-question').text();

    console.log(`Parsed question: ${question}`);

    const assistantResponse = (await OpenAIService.completion(
        [createSystemPrompt(), createMessage(question)],
        'gpt-4o-mini',
        false
    )) as OpenAI.Chat.Completions.ChatCompletion;

    console.log(`AI answer: ${assistantResponse.choices[0].message.content}`);

    if (!assistantResponse.choices) {
        console.error('Answer from AI is not defined');
        res.send('Answer from AI is not defined');
        return;
    }

    let loginResponse = await login(
        process.env.XYZ_PAGE_USERNAME,
        process.env.XYZ_PAGE_PASSWORD,
        assistantResponse.choices[0].message.content as string
    );

    if (!loginResponse.ok) {
        throw new Error(`Login response status: ${resp.status}`);
    }
    res.send(await loginResponse.text());
});

const createSystemPrompt = (): ChatCompletionMessageParam => {
    return {
        role: 'system',
        content: `You answer on question, simple, you give the simplest shortest answer
        
        <snippet_examples>
        USER: current year
        AI: 2024
        
        USER: rok odzyskania przez polskę niepodległości
        AI: 918
        
        USER: Rok lądowania na Księżycu?
        AI: 1969
        </snippet_examples>
        `,
    };
};

const createMessage = (question: string): ChatCompletionMessageParam => {
    return { content: question, role: 'user' };
};

const login = async (login: string, password: string, answer: string) => {
    if (!process.env.XYZ_API) {
        throw new Error('XYZ_API is not defined');
    }
    return await fetch(process.env.XYZ_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            username: login,
            password: password,
            answer: answer,
        }),
    });
};

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
