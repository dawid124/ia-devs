export interface IRequest {
    apikey: string;
    description: string;
    copyright: string;
    'test-data': ITestData[];
}

export interface ITestData {
    question: string;
    answer: number;
    test: ITest;
}

export interface ITest {
    q: string;
    a: string;
    n?: number;
}

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