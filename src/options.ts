import '../styles/options.scss';
import { ANSWERS_NUMBER_SETTINGS, PROMT_SETTINGS } from './models';
import { getStorageItem, setStorageItem } from './storage';

const sliderLabelName = 'number of answers: ';

const textarea: HTMLTextAreaElement = document.getElementById('textarea') as HTMLTextAreaElement;

const rangeValue = document.querySelector('#number-of-answers');
const range = document.querySelector('#fader') as HTMLInputElement;

(async function load() {
  textarea.value = (await getStorageItem(PROMT_SETTINGS)) ?? '';

  const numberOfAnswers = await getStorageItem(ANSWERS_NUMBER_SETTINGS);

  rangeValue.textContent = sliderLabelName + numberOfAnswers;
  range.value = numberOfAnswers;
})();

textarea.addEventListener('input', (event: Event) => {
  const value = (event.target as HTMLInputElement).value.trim();

  setStorageItem(PROMT_SETTINGS, value);
});

range.addEventListener('input', (event) => {
  const value: number = +(event.target as HTMLInputElement).value;
  rangeValue.textContent = sliderLabelName + value;

  setStorageItem(ANSWERS_NUMBER_SETTINGS, value);
});
