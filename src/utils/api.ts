import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai';

import { CompletitionResponse, Info, Settings } from '../models';
import * as SettingsService from './settings';

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

export const generateResponse = async (info: Info): Promise<CompletitionResponse[]> => {
  try {
    const settings = await SettingsService.getSettings(info);

    const response = await openai.createChatCompletion(
      {
        model: settings.model,
        messages: getMessages(info, settings),
        temperature: 0.5,
        max_tokens: settings.max_tokens,
        n: settings.answersCount,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      },
      {
        timeout: 10000,
      },
    );

    return response.data.choices as CompletitionResponse[];
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    throw new Error('An error occurred while generating the response');
  }
};

const getMessages = (info: Info, settings: Settings) => {
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: settings.promt,
    },
    ...info.messages,
  ];

  return messages;
};
