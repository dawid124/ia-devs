import { EModel } from '../service/OpenAIService';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import OllamaService from '../service/OllamaService';

export const askAI = (model: EModel, text: string) => {
    return OllamaService.chat(model, [createSystemPrompt(), createMessage(text)]);
};

const createSystemPrompt = (): ChatCompletionMessageParam => {
    return {
        role: 'system',
        content: `you are a tool for censorship
        
        <rules>
        - replace censored data with the word "CENZURA"
        - o not change other information, keep syntax
        - always censor data: name + lastname
        - always censor data: age
        - always censor data: city (Lublin, Łódź, Katowice..)
        - always censor data: street + street number
        </rules>
        
        <snippet_examples>
        USER: 
        Informacje o tej osobie: Kamil Woźniak. Mieszka w Łodzi przy ulicy Paderwskiego 997. Wiek: 31 lat.
        
        AI: Informacje o tej osobie: CENZURA. Mieszka w CENZURA przy ulicy CENZURA. Wiek: CENZURA lat.
        
        USER: 
        Informacje o tej osobie: Kamil Woźniak. Mieszka w Łodzi przy ulicy Paderwskiego 997. Wiek: 31 lata.
        
        AI: Informacje o tej osobie: CENZURA. Mieszka w CENZURA przy ulicy CENZURA. Wiek: CENZURA lata.
        
        USER: 
        Informacje o tej osobie: Kamil Woźniak. Mieszka w Poznaniu przy ulicy Paderwskiego 997. Wiek: 31 lat.
        
        AI: Informacje o tej osobie: CENZURA. Mieszka w CENZURA przy ulicy CENZURA. Wiek: CENZURA lat.
        
        USER: 
        Podejrzany nazywa się Mateusz Nieznański. zameldowany Warszawa, ul. testowa 123. Wiek: 78 lat.
        
        AI: Podejrzany nazywa się CENZURA. zameldowany CENZURA, ul. CENZURA. Wiek: CENZURA lat.
        
        USER: 
        Podejrzany nazywa się Mateusz Nieznański. Adres: Rzeszów, ul. Dobryszycka 333. Wiek: 55 lat.
        
        AI: Podejrzany nazywa się CENZURA. Adres: CENZURA, ul. CENZURA. Wiek: CENZURA lat.
        
        USER: 
        Podejrzany nazywa się Mateusz Nieznański. Mieszka w Warszawie przy ul. testowa 123. Ma 32 lata.
        
        AI: Podejrzany nazywa się CENZURA. Mieszka w CENZURA przy ul. CENZURA. Ma CENZURA lata.
        
        USER: 
        Podejrzany nazywa się Mateusz Nieznański. Mieszka w Szczecinie przy ul. testowa 123. Ma 32 lata.
        
        AI: Podejrzany nazywa się CENZURA. Mieszka w CENZURA przy ul. CENZURA. Ma CENZURA lata.
        </snippet_examples>
        `,
    };
};

const createMessage = (question: string): ChatCompletionMessageParam => {
    return { content: question, role: 'user' };
};
