import { IAnswerList, IQuestionList, ITestData, ITest } from '../types';

export class JsonService {
    static prepareData(testData: ITestData[]): string {
        this.fixCalculations(testData);
        return this.prepareQuestions(testData);
    }

    private static fixCalculations(list: ITestData[]): void {
        list.forEach(data => {
            const calculatedAnswer = eval(data.question);
            if (calculatedAnswer !== data.answer) {
                console.log(
                    `wrong calculation for: ${data.question}, wrong answer: ${data.answer}, correct: ${calculatedAnswer}`
                );
                data.answer = calculatedAnswer;
            }
        });
    }

    private static prepareQuestions(list: ITestData[]): string {
        const questions: ITest[] = list.filter(data => data.test).map(data => data.test);
        const questionList: IQuestionList = {
            questions: questions.map((q, index) => {
                q.n = index;
                return {
                    number: index,
                    question: q.q,
                };
            }),
        };
        return JSON.stringify(questionList);
    }

    static updateTestDataWithAnswers(testData: ITestData[], aiAnswers: IAnswerList): void {
        testData
            .filter(data => data.test)
            .forEach(data => {
                const answer = aiAnswers.answers.find(i => i.number == data.test.n)?.answer;
                if (answer) {
                    data.test.a = answer;
                    delete data.test.n;
                }
            });
    }
}
