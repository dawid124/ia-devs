import { EModel } from '../service/OpenAIService';
import CentralService from '../service/central/CentralService';
import { IRequest, IAnswerList } from './types';
import { JsonService } from './services/JsonService';
import { askAI, outputFormat } from './prompt';
import { Request, Response } from 'express';

const express = require('express');
require('dotenv').config({ path: '../.env' });

const app = express();
const port = 3000;

const getAiResponses = async (questions: string): Promise<IAnswerList> => {
    const response = await askAI(questions, EModel.gpt4oMini, outputFormat);
    // const response = await askAI(questions, EModel.gpt4oMini, {type: 'json_object'});
    if (!response.choices) {
        throw new Error('Unexpected response format from AI');
    }
    return JSON.parse(response.choices[0].message.content!);
};

app.get('/', async (req: Request, res: Response) => {
    try {
        if (!process.env.AI_DEVS_KEY) {
            throw new Error('AI_DEVS_KEY is not defined');
        }

        const data = await CentralService.data<IRequest>('json.txt');
        console.log('Data from central:', data);

        const questions = JsonService.prepareData(data['test-data']);
        const aiAnswers = await getAiResponses(questions);
        console.log('AI answer:', aiAnswers);

        if (!aiAnswers) {
            console.error('Answer from AI is not defined');
            res.send('Answer from AI is not defined');
            return;
        }

        JsonService.updateTestDataWithAnswers(data['test-data'], aiAnswers);

        data.apikey = process.env.AI_DEVS_KEY;
        const response = await CentralService.report({
            task: 'JSON',
            apikey: process.env.AI_DEVS_KEY,
            answer: data,
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
