import { Injectable, Logger } from '@nestjs/common';
import { Configuration, CreateChatCompletionRequest, CreateCompletionRequest, OpenAIApi } from 'openai';
import { environment } from 'src/environment';

@Injectable()
export class ReceptorService {

    private readonly logger = new Logger(ReceptorService.name);

    private readonly openAi: OpenAIApi;

    private IA_model = "gpt-3.5-turbo";

    private IA_complete_model = "text-davinci-003";

    private IA_temperature = 0.9; //closest to human response in 0..1 scale.

    private IA_maxTokens = 350; // not necesary, just check that prompt <= 2048 tokens.

    constructor() {
        const configuration = new Configuration({
            organization: environment.openAI_OrgID,
            apiKey: environment.openAI_key,
        });
        this.openAi = new OpenAIApi(configuration);

    }

    public setIAModel(model: string) {
        if(model.includes(":")) {
            model = model.replace(":","-");
        }
        this.IA_model = model;
    }

    public setIAMaxTokens(tokens: number) {
        this.IA_maxTokens = tokens;
    }

    public async listModels() {
        try {
            const models = await this.openAi.listModels()
            return models.data;
        } catch (error) {
            this.logger.error('Error getting models:', error);
            throw error;
        }
    }

    public setIATemperature(temp: number) {
        this.IA_temperature = temp;
    }

    public async getChat(mockText: string, examples: string, interfaces: string) {
        try {
            const params: CreateChatCompletionRequest = {
                model: this.IA_model,
                messages: [
                    {"role": "system", "content": 'You are an expert mocking data, you always reply with a JSON or anything else than mocked data. if you dont understand something or something else is asked or you only can reply with "ERROR".'},
                    {"role": "user", "content": `please create a JSON array list of ${examples} elements of this class, you can interprepetate the property names and provide mock data:${mockText} ${interfaces ? `using this interfaces ${interfaces}`: ''} (Remember always reply with just a JSON)`}],
                temperature: this.IA_temperature,
                // max_tokens: this.IA_maxTokens
            }
            console.log(params.messages);
            const response = await this.openAi.createChatCompletion(params);

            const { data } = response;
            if (data.choices.length) {
                return {
                    data : this.getJsonString(data.choices[0].message.content)
                }
                    
            }
            return data;
        } catch (error) {
            this.logger.error('Error getting answer:', error);
            throw error;
        }
    }

    public async getComplete(mockText: string, examples: string, interfaces: string) {
        try {
            const params: CreateCompletionRequest = {
                prompt: `please create a JSON array list of ${examples} elements of this class, you can interprepetate the property names and provide mock data:${mockText} ${interfaces ? `using this interfaces ${interfaces}`: ''} (Remember always reply with just a JSON)`,
                model: this.IA_complete_model,
                temperature: this.IA_temperature,
                max_tokens: this.IA_maxTokens
            }
            const response = await this.openAi.createCompletion(params);

            const { data } = response;
            if (data.choices.length) {
                return {
                    data : this.getJsonString(data.choices[0].text)
                }
            }
            return data;
        } catch (error) {
            this.logger.error('Error getting answer:', error);
            throw error;
        }
    }


    public async getJsonConvert(jsonText: string, result: string, notes: string) {
        try {
            const params: CreateChatCompletionRequest = {
                model: this.IA_model,
                messages: [
                    {"role": "system", "content": 'You are an expert creating classes or interfaces, you always reply with the indicated result in the indicated coding language. if you dont understand something or something else is asked or you only can reply with "ERROR".'},
                    {"role": "user", "content": `please create a ${result}, based on this JSON: ${jsonText}, ${notes ? `use this notes and apply them to the desired result: ${notes},` : ''} remember always reply with in the desired code language, dont include any implementation of the class, just the class itself`}],
                temperature: this.IA_temperature,
                // max_tokens: this.IA_maxTokens
            }
            console.log(params.messages);
            const response = await this.openAi.createChatCompletion(params);

            const { data } = response;
            if (data.choices.length) {
                return {
                    data : this.getClassString(data.choices[0].message.content)
                }
                    
            }
            return data;
        } catch (error) {
            this.logger.error('Error getting answer:', error);
            throw error;
        }
    }

    public getJsonString(str : string): string {
        const startSubStr = str.indexOf("[");
        const endSubStr = str.lastIndexOf("]") + 1;
        const substring = str.substring(
            startSubStr,
            endSubStr > 0 ? endSubStr + 1 : str.length + 1
        );
        return substring;
    }

    public getClassString(str : string): string {
        console.log(str);
        const startSubStr = str.indexOf("```")+3;
        console.log(startSubStr);
        const endSubStr = str.lastIndexOf("```") - 2;
        const substring = str.substring(
            startSubStr,
            endSubStr > 0 ? endSubStr + 1 : str.length + 1
        );
        return substring;
    }


}
