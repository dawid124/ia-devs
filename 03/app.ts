import {EModel} from "../service/OpenAIService";
import CentralService from "../service/CentralService";
import {askAI, IAnswerList, IQuestionList, outputFormat} from "./prompt";

const express = require('express')
require('dotenv').config({ path: '../.env' })

const app = express()
const port = 3000

interface IRequest {
    apikey: string;
    description: string;
    copyright: string;
    'test-data': ITestData[];
}

interface ITestData {
    question: string;
    answer: number;
    test: ITest;
}

interface ITest {
    q: string;
    a: string;
    n?: number;
}

app.get('/', async (req, res) => {
    try {
        let data = await CentralService.data<IRequest>('json.txt');
        console.log(`Data from central: `);
        console.log(data);

        let testData = data["test-data"];
        fixCalculation(testData);

        const questionForAi = getQuestions(testData);

        // const assistantResponse = await askAI(questionForAi, EModel.gpt4oMini, {type: "json_object"});
        const assistantResponse = await askAI(questionForAi, EModel.gpt4oMini, outputFormat);
        // const assistantResponse = await askAI(questionForAi, EModel.gpt4o, {type: "json_object"});
        // const assistantResponse = await askAI(questionForAi, EModel.gpt4o, outputFormat);
        //
        const aiAnswers: IAnswerList = JSON.parse(assistantResponse.choices[0].message.content);
        console.log(`AI answer: `);
        console.log(aiAnswers);

        testData.filter(data => data.test).forEach(data => {
            data.test.a = aiAnswers.answers.find(i => i.number == data.test.n).answer;
            delete data.test.n;
        });

        data.apikey = process.env.AI_DEVS_KEY
        const response = await CentralService.report({task: 'JSON', apikey: process.env.AI_DEVS_KEY, answer: data})

        res.send(response)
    } catch (err) {
        console.log(err);
        res.send(err)
    }
})

const fixCalculation = (list: ITestData[]) => {
    list.forEach(data => {
        const calculatedAnswer = eval(data.question);
        if (calculatedAnswer !== data.answer) {
            console.log(`wrong calculation for: ${data.question}, wrong answer: ${data.answer}, correct: ${calculatedAnswer}`);
            data.answer = calculatedAnswer;
        }
    })
}

const getQuestions = (list: ITestData[]) => {
    let questions: ITest[] = list.filter(data => data.test).map(data => data.test);

    const obj: IQuestionList = {
        questions: []
    }
    for (let i = 0; i < questions.length; i++) {
        questions[i].n = i;
        obj.questions.push({number: i, question: questions[i].q});
    }

    console.log(obj);
    return JSON.stringify(obj);
}


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
