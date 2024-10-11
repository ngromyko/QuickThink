import { currentPathName } from '../contentScript';
import { ANSWERS_NUMBER_SETTINGS, CompletitionResponse } from '../models';
import { getStorageItem } from '../storage';
import { generateResponse } from '../utils/api';
import { extractMessageDataFromList } from './messageForm';

const createAnswersContainer = async () => {

  //console.log('createAnswersContainer');

  const messageElement = document.querySelector('.msg-s-message-list-content') as HTMLUListElement;
  const messageData = extractMessageDataFromList(messageElement);

  //console.log('messageData', messageData);

  if (messageData?.length) {
    const captureLocation = currentPathName;
    const interlocutor = document.getElementById('thread-detail-jump-target')?.textContent.trim();

    const answers: CompletitionResponse[] = await generateResponse({
      messages: messageData,
      interlocutorName: interlocutor,
    });

    if (currentPathName === captureLocation) {
      const ul = await createUlElement(answers);
      const container = document.querySelector('.msg-s-message-list-container');
      container?.appendChild(ul);
    }
  }
};

const createUlElement = async (answers: CompletitionResponse[]) => {
  const ul = document.createElement('ul');
  ul.id = 'ul-answers';

  const answersCountSetting: number = await getStorageItem(ANSWERS_NUMBER_SETTINGS);

  answers.forEach((answer) => {
    const newListItem = createLiElement(answer.message.content, answersCountSetting);
    ul.appendChild(newListItem);
  });

  return ul;
};

const createLiElement = (answer: string, answersCountSetting: number) => {
  const newListItem = document.createElement('li');
  newListItem.style.margin = '8px';

  const span = document.createElement('span');
  if (answersCountSetting > 1) {
    span.innerHTML = answer.trunc(130);
  } else {
    span.innerHTML = answer.trunc(200);
  }

  const button = createAnswerButton(answer);
  button.appendChild(span);

  newListItem.appendChild(button);

  return newListItem;
};

const createAnswerButton = (answer: string) => {
  const button = document.createElement('button');
  button.className = 'answer-button';

  button.addEventListener('click', () => {
    const input = document.querySelector('.msg-form__contenteditable');
    const p = input?.querySelector('p');
    if (p) {
      p.textContent = answer;
      input.dispatchEvent(new InputEvent('input', { data: answer, bubbles: true }));
    }
  });

  return button;
};

const removeAnswersContainer = () => {
  const ul = document.getElementById('ul-answers');
  ul?.remove();
};

export { createAnswersContainer, removeAnswersContainer };
