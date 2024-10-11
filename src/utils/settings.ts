import { ANSWERS_NUMBER_SETTINGS, Info, MODEL_SETTINGS, PROMT_SETTINGS, Settings, TEMPLATE } from '../models';
import { getStorageItem } from '../storage';

export const getSettings = async (info: Info): Promise<Settings> => {
  const model = await getAiModel();
  const promt = await getStorageItem(PROMT_SETTINGS);
  const answersCount = await getStorageItem(ANSWERS_NUMBER_SETTINGS);

  const additionalInfo = promt ? `Additional information: ${promt}` : '';
  const formatedPromt = replaceVariablesInString(TEMPLATE, { ...info, additionalInfo });

  return { answersCount, max_tokens: parseInt(process.env.MAX_TOKENS, 1000), model, promt: formatedPromt };
};

async function getAiModel(){
  return await getStorageItem(MODEL_SETTINGS);
};

const replaceVariablesInString = (text: string, args: object): string => {
  for (const [key, value] of Object.entries(args)) {
    const regex = new RegExp(`{${key}}`, 'g');
    text = text.replace(regex, value);
  }
  return text;
};
