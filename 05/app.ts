import CentralService from '../service/central/CentralService';
import { askAI } from './prompt';
import { Request, Response } from 'express';

const express = require('express');
require('dotenv').config({ path: '../.env' });

const app = express();
const port = 3000;

const getAiResponses = async (text: string): Promise<string> => {
    const response = await askAI('gemma2:2b', text);
    if (!response.message) {
        throw new Error('Unexpected response format from AI');
    }
    return response.message.content;
};

app.get('/', async (req: Request, res: Response) => {
    try {
        if (!process.env.AI_DEVS_KEY) {
            throw new Error('AI_DEVS_KEY is not defined');
        }

        const data = await CentralService.dataText('cenzura.txt');
        console.log('Data from central:', data);

        const aiAnswers = await getAiResponses(data);
        console.log('AI answer        :', aiAnswers);

        if (!aiAnswers) {
            console.error('Answer from AI is not defined');
            res.send('Answer from AI is not defined');
            return;
        }

        const response = await CentralService.report({
            task: 'CENZURA',
            apikey: process.env.AI_DEVS_KEY,
            answer: aiAnswers,
        });

        res.send(response);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
