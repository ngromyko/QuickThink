import { ChatCompletionRequestMessage, ChatCompletionResponseMessage } from 'openai';

export const PROMT_SETTINGS = 'PROMT_SETTINGS';
export const ANSWERS_NUMBER_SETTINGS = 'ANSWERS_NUMBER_SETTINGS';

export const TEMPLATE =
  'Business conversation dialogue. Need to generate a new response to answer a person on the chat in a valid, relevant, friendly and briefly format. Settings: work and career theme, first-person responses, interlocutor name - {interlocutorName}. {additionalInfo}.';

export interface CompletitionResponse {
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
