export interface Choice {
  text: string;
}

export enum SelectedOption {
  quickReplies,
  smartReplies,
}

export const PROMT_SETTINGS = 'PROMT_SETTINGS';
export interface AppStorage {
  selectedOption: SelectedOption;
  [PROMT_SETTINGS]: string;
}
