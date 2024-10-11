import { ChatCompletionRequestMessage, ChatCompletionResponseMessage } from 'openai';

export const PROMT_SETTINGS = 'PROMT_SETTINGS';
export const ANSWERS_NUMBER_SETTINGS = 'ANSWERS_NUMBER_SETTINGS';
export const API_KEY_SETTINGS = 'API_KEY_SETTINGS';
export const MODEL_SETTINGS = 'MODEL_SETTINGS';

export const TEMPLATE = `You are a professional networker on LinkedIn. Your task is to formulate a brief, friendly, and relevant response to a message in a chat, considering the context of business correspondence.

Context: {contextInfo}
Interlocutor's name: {interlocutorName}
Additional information: {additionalInfo}

Use the following principles when composing your response:
1. Respond in the first person.
2. Maintain a professional yet friendly tone.
3. Focus on work and career-related topics.
4. Be concise but informative (no more than 2-3 sentences).
5. Personalize the response using the interlocutor's name and conversation context.
6. If appropriate, ask a follow-up question to continue the dialogue.
7. Avoid excessive formality and clichés.

Generate the response:`;

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
