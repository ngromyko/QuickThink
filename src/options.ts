import '../styles/options.scss';
import { PROMT_SETTINGS, SelectedOption } from './models';
import { getStorageItem, setStorageItem } from './storage';

const quickReplies = document.getElementById('quickReplies');
const smartReplies = document.getElementById('smartReplies');
const textarea: HTMLTextAreaElement = document.getElementById('textarea') as HTMLTextAreaElement;

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
