import OpenAIService from "./OpenAIService";
import OpenAI from "openai";
import {ChatCompletionMessageParam} from "openai/resources/chat/completions";

const express = require('express')
const cheerio = require('cheerio')
require('dotenv').config({ path: '../.env' })

const app = express()
const port = 3000


app.get('/', async (req, res) => {
    const resp = await fetch('https://xyz.ag3nts.org/');

    if (!resp.ok) {
        throw new Error(`Fetch Response status: ${resp.status}`);
    }

    const content = await resp.text();
    const html = cheerio.load(content)
    const question = html('#human-question').text();

    console.log(`Parsed question: ${question}`);

    const assistantResponse = await OpenAIService.completion([
        createSystemPrompt(),
        createMessage(question)
    ], "gpt-4", false) as OpenAI.Chat.Completions.ChatCompletion;

    console.log(`AI answer: ${assistantResponse.choices[0].message.content}`)

    let loginResponse = await login(assistantResponse.choices[0].message.content);

    if (!loginResponse.ok) {
        throw new Error(`Login response status: ${resp.status}`);
    }
    res.send(await loginResponse.text())
})

const createSystemPrompt = (): ChatCompletionMessageParam => {
    return {
        role: "system",
        content: `You answer on question, simple, you give the simplest shortest answer
        
        <snippet_examples>
        USER: current year
        AI: 2024
        
        USER: rok odzyskania przez polskę niepodległości
        AI: 918
        
        USER: Rok lądowania na Księżycu?
        AI: 1969
        </snippet_examples>
        `
    };
};

const createMessage = (question: string): ChatCompletionMessageParam => {
    return { content: question, role: "user" }
}

const login = async (awswer: string) => {
    return await fetch('https://xyz.ag3nts.org/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'username': 'tester',
            'password': '574e112a',
            'answer': awswer
        })
    });
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})