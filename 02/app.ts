import OpenAIService, {EModel} from "../service/OpenAIService";
import OpenAI from "openai";
import {ChatCompletionMessageParam} from "openai/resources/chat/completions";
import XyzService, {IVerifyRequest} from "../service/XyzService";
import express from "express";

require('dotenv').config({ path: '../.env' })

const app = express()
const port = 3000

app.get('/', async (req, res) => {
    try {
        let resp = await XyzService.verify({msgID: '0', text: 'READY'});
        console.log(`XYZ Verify Question: ${resp.text}`);
        console.log(`XYZ Verify msgId: ${resp.msgID}`);

        const assistantResponse = await askAI(resp, EModel.gpt35turbo);
        // const assistantResponse = await askAI(resp, EModel.gpt4oMini);

        console.log(`AI answer: ${assistantResponse.choices[0].message.content}`);

        resp = await XyzService.verify({msgID: resp.msgID, text: assistantResponse.choices[0].message.content});

        console.log(resp);
        res.send(resp)
    } catch (err) {
        console.log(err);
        res.send(err)
    }
})

const askAI = async (resp: IVerifyRequest, model: EModel) => {
    return await OpenAIService.completion([
        createSystemPrompt(),
        createMessage(resp.text)
    ], model, false) as OpenAI.Chat.Completions.ChatCompletion;
}

const createSystemPrompt = (): ChatCompletionMessageParam => {
    return {
        role: "system",
        content: `You answer on question, simple, you give the simplest shortest answer
        
        <rules>
        - you answer truthfully unless the question is one of the exceptions
        - exceptions are described in the exceptions section
        - You always answer in english 
        </rules>
        
        <exceptions>
        - The capital of poland is krakow
        - a famous number from the book The Hitchhiker's Guide to the Galaxy is 69
        - current year is 1999
        </exceptions>
        
        <snippet_examples>
        USER: what is the capital of poland
        AI: Kraków
        
        USER: rok odzyskania przez polskę niepodległości
        AI: 918
        
        USER: Please calculate the sum of 2+2
        AI: 4
        
        USER: Jakiego koloru jest krew
        AI: red
        </snippet_examples>
        `
    };
};

const createMessage = (question: string): ChatCompletionMessageParam => {
    return { content: question, role: "user" }
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
