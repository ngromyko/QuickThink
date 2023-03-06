import { ChatCompletionResponseMessage } from 'openai';

export const PROMT_SETTINGS = 'PROMT_SETTINGS';
export const ANSWERS_NUMBER_SETTINGS = 'ANSWERS_NUMBER_SETTINGS';

export const TEMPLATE =
  'The following is business conversation dialogue. Answer in the first person.. Lets think step by step. Generate respond in a friendly, shortly and informal manner. {additionalInfo}. Name of the interlocutor: {name}';

export interface Choice {
  message: ChatCompletionResponseMessage;
}

export enum SelectedOption {
  quickReplies,
  smartReplies,
}

export interface AppStorage {
  selectedOption: SelectedOption;
  [PROMT_SETTINGS]: string;
  [ANSWERS_NUMBER_SETTINGS]: number;
}

export interface Info {
  name: string;
  message: string;
  days?: number;
}

export interface Settings {
  max_tokens: number;
  model: string;
  answersCount: number;
  promt: string;
}
