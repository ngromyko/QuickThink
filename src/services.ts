import { Choice, PROMT_SETTINGS, SelectedOption } from './models';
import { getStorageItem } from './storage';

const API_KEY = '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';
const API_URL = 'https://api.openai.com/v1/completions';

const TEMPLATE = `Chatting with a Person on LinkedIn. Respond in a friendly, short and informal manner. In respond use the following information: {0}. Person: {1}. \n My Answer:`;

export const generateResponse = async (message: string, max_tokens = 200, answersCount = 1): Promise<Choice[]> => {
  try {
    const promt = await getStorageItem(PROMT_SETTINGS);
    const formatedPromt = TEMPLATE.format(promt, message);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: await getAiModel(),
        prompt: formatedPromt,
        temperature: 0.5,
        max_tokens: max_tokens,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        best_of: 3,
        n: answersCount,
        stop: ['Person:', 'My Answer:'],
      }),
    });
    const json = await response.json();
    return json.choices;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while generating the response');
  }
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
