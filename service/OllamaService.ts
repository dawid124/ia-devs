import ollama, { ChatResponse, Message } from 'ollama';

class OllamaService {
    chat(model: string, messages: Message[]): Promise<ChatResponse> {
        return ollama.chat({ model, messages });
    }
}

export default new OllamaService();
