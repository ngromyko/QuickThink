import '../styles/options.scss';
import { ANSWERS_NUMBER_SETTINGS, PROMT_SETTINGS, SelectedOption } from './models';
import { getStorageItem, setStorageItem } from './storage';

const quickReplies = document.getElementById('quickReplies');
const smartReplies = document.getElementById('smartReplies');

const textarea: HTMLTextAreaElement = document.getElementById('textarea') as HTMLTextAreaElement;

const rangeValue = document.querySelector('#number-of-answers');
const range = document.querySelector('#fader') as HTMLInputElement;

(async function load() {
  const selectedOption: SelectedOption = await getStorageItem('selectedOption');

  if (selectedOption === SelectedOption.quickReplies) {
    quickReplies.className = 'selected';
    smartReplies.removeAttribute('class');
  } else {
    quickReplies.removeAttribute('class');
    smartReplies.className = 'selected';
  }

  textarea.value = (await getStorageItem(PROMT_SETTINGS)) ?? '';

  const numberOfAnswers = await getStorageItem(ANSWERS_NUMBER_SETTINGS);

  rangeValue.textContent = 'Number of answers: ' + numberOfAnswers;
  range.value = numberOfAnswers;
})();

textarea.addEventListener('input', (event: Event) => {
  const value = (event.target as HTMLInputElement).value.trim();

  setStorageItem(PROMT_SETTINGS, value);
});

quickReplies.addEventListener('click', async () => {
  quickReplies.classList.add('selected');
  smartReplies.classList.remove('selected');

  await setStorageItem('selectedOption', SelectedOption.quickReplies);
});

smartReplies.addEventListener('click', async () => {
  smartReplies.classList.add('selected');
  quickReplies.classList.remove('selected');

  await setStorageItem('selectedOption', SelectedOption.smartReplies);
});

range.addEventListener('input', (event) => {
  const value: number = +(event.target as HTMLInputElement).value;
  rangeValue.textContent = 'Number of answers: ' + value;

  setStorageItem(ANSWERS_NUMBER_SETTINGS, value);
});
