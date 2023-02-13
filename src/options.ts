import '../styles/options.scss';
import { SelectedOption, setStorageItem, getStorageItem } from './storage';

// Get the options elements
const quickReplies = document.getElementById('quickReplies');
const smartReplies = document.getElementById('smartReplies');

loaded();

async function loaded() {
  const selectedOption: SelectedOption = await getStorageItem('selectedOption');

  if (selectedOption === SelectedOption.quickReplies) {
    quickReplies.className = 'selected';
    smartReplies.className = '';
  } else {
    quickReplies.className = '';
    smartReplies.className = 'selected';
  }
}

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
