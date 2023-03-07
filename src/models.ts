import { ChatCompletionRequestMessage, ChatCompletionResponseMessage } from 'openai';

export const PROMT_SETTINGS = 'PROMT_SETTINGS';
export const ANSWERS_NUMBER_SETTINGS = 'ANSWERS_NUMBER_SETTINGS';

export const TEMPLATE =
  'The following is business conversation dialogue. Work and career theme. Generate first-person responses. Lets think step by step. Generate respond in a friendly and shortly. {additionalInfo}. Name of the interlocutor: {interlocutorName}';

export interface Choice {
  message: ChatCompletionResponseMessage;
}

export interface AppStorage {
  [PROMT_SETTINGS]: string;
  [ANSWERS_NUMBER_SETTINGS]: number;
}

export interface Info {
  interlocutorName: string;
  messages: Message[];
}

export interface Settings {
  max_tokens: number;
  model: string;
  answersCount: number;
  promt: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Message extends ChatCompletionRequestMessage {}
