import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai';

import { Choice, Info, Settings } from '../models';
import { getSettings } from '../utils';

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

export const generateResponse = async (info: Info): Promise<Choice[]> => {
  try {
    const settings = await getSettings(info);

    const response = await openai.createChatCompletion({
      model: settings.model,
      messages: getMessages(info, settings),
      temperature: 0.5,
      max_tokens: settings.max_tokens,
      n: settings.answersCount,
      user: info.interlocutorName,
    });

    return response.data.choices as Choice[];
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
