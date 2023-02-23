export const PROMT_SETTINGS = 'PROMT_SETTINGS';
export const ANSWERS_NUMBER_SETTINGS = 'ANSWERS_NUMBER_SETTINGS';

export const TEMPLATE =
  'The following is conversation on linkedin. You need to answer on my behalf. Genetate respond in a friendly, shortly and informal manner. {additionalInfo} The answer in the language that use {name}. {name}: {message}. Answer:';

export interface Choice {
  text: string;
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
