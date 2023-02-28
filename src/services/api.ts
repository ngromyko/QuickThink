import { ANSWERS_NUMBER_SETTINGS, Choice, Info, PROMT_SETTINGS, SelectedOption, TEMPLATE } from '../models';
import { getStorageItem } from '../storage';

const API_URL = 'https://api.openai.com/v1/completions';

interface Settings {
  max_tokens: number;
  model: string;
  answersCount: string;
  promt: string;
}

export const generateResponse = async (info: Info): Promise<Choice[]> => {
  try {
    const settings = await getSettings(info);
    const response = await fetch(API_URL, createParams(settings));

    return (await response.json()).choices;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while generating the response');
  }
};

function createParams(settings: Settings) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
    body: JSON.stringify({
      model: settings.model,
      prompt: settings.promt,
      temperature: 0.5,
      max_tokens: settings.max_tokens,
      // top_p: 0.9,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      //best_of: 6,
      n: settings.answersCount,
    }),
  };
}

const getSettings = async (info: Info): Promise<Settings> => {
  const model = await getAiModel();
  const promt = await getStorageItem(PROMT_SETTINGS);
  const answersCount = await getStorageItem(ANSWERS_NUMBER_SETTINGS);

  const additionalInfo = promt
    ? `You can use the following information about me to generate a valid answer, but only if the information was requested by the interlocutor: ${promt}`
    : '';
  const formatedPromt = replaceVariablesInString(TEMPLATE, { ...info, additionalInfo });

  return { answersCount, max_tokens: 160, model, promt: formatedPromt };
};

async function getAiModel() {
  const selectedOption: SelectedOption = await getStorageItem('selectedOption');

  switch (selectedOption) {
    case SelectedOption.quickReplies:
      return 'text-curie-001';
    default:
      return 'text-davinci-003';
  }
}

function replaceVariablesInString(text: string, args: object): string {
  for (const [key, value] of Object.entries(args)) {
    const regex = new RegExp(`{${key}}`, 'g');
    text = text.replace(regex, value);
  }
  return text;
}
