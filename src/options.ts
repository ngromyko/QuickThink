import '../styles/options.scss';
import { ANSWERS_NUMBER_SETTINGS, PROMT_SETTINGS, API_KEY_SETTINGS, MODEL_SETTINGS } from './models';
import { getStorageItem, setStorageItem } from './storage';

const sliderLabelName = 'Number of answers: ';

const textarea = document.getElementById('textarea') as HTMLTextAreaElement;
const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
const modelSelect = document.getElementById('model') as HTMLSelectElement;
const rangeValue = document.getElementById('number-of-answers');
const range = document.getElementById('fader') as HTMLInputElement;

async function load() {
  // Load existing settings
  textarea.value = (await getStorageItem(PROMT_SETTINGS)) ?? '';
  apiKeyInput.value = (await getStorageItem(API_KEY_SETTINGS)) ?? '';
  modelSelect.value = (await getStorageItem(MODEL_SETTINGS)) ?? 'gpt-4o-mini';
  
  const numberOfAnswers = await getStorageItem(ANSWERS_NUMBER_SETTINGS) ?? 1;
  rangeValue.textContent = sliderLabelName + numberOfAnswers;
  range.value = numberOfAnswers.toString();
}

// Load saved settings when the page is opened
load();

// Event listeners for input changes with instant saving
textarea.addEventListener('input', (event: Event) => {
  const value = (event.target as HTMLTextAreaElement).value.trim();
  setStorageItem(PROMT_SETTINGS, value);
});

apiKeyInput.addEventListener('input', (event: Event) => {
  const value = (event.target as HTMLInputElement).value.trim();
  setStorageItem(API_KEY_SETTINGS, value);
});

modelSelect.addEventListener('change', (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  setStorageItem(MODEL_SETTINGS, value);
});

range.addEventListener('input', (event: Event) => {
  const value = parseInt((event.target as HTMLInputElement).value);
  rangeValue.textContent = sliderLabelName + value;
  setStorageItem(ANSWERS_NUMBER_SETTINGS, value);
});
