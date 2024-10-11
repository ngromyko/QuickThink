import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai';

import { API_KEY_SETTINGS, CompletitionResponse, Info, MODEL_SETTINGS, Settings } from '../models';
import * as SettingsService from './settings';
import { getStorageItem } from '../storage';




export const generateResponse = async (info: Info): Promise<CompletitionResponse[]> => {
  try {
    const settings = await SettingsService.getSettings(info);

    const apiKey = await getStorageItem(API_KEY_SETTINGS);

   // console.log('apiKey', apiKey);

    if (!apiKey) {
      //alert('API Key is not set');

      chrome.runtime.sendMessage("showOptions");

      //chrome.runtime.openOptionsPage();

      throw new Error('API Key is not set');

      
    }

    const configuration = new Configuration({
      apiKey: apiKey,
    });

    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion(
      {
        model: settings.model,
        messages: getMessages(info, settings),
        temperature: 1,
        max_tokens: settings.max_tokens,
        n: settings.answersCount,
        frequency_penalty: 1,
        presence_penalty: 1,
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
