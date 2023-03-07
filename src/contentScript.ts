import '../styles/content.scss';
import { ANSWERS_NUMBER_SETTINGS, Choice } from './models';
import { generateResponse } from './services/api';
import { extractMessageDataFromList } from './services/info';
import { addSendButtonListener } from './services/messageForm';
import { getStorageItem } from './storage';
import './string.extensions';

const REPLY_BUTTON_NAME = 'AI Reply';

let locationPathName = '';

checkTrigger();
function checkTrigger() {
  addSendButtonListener();

  if (locationPathName !== window.location.pathname) {
    removeAnswersContainer();
    document.getElementById('custom-btn-container')?.remove();

    if (getActionBtnContainer()) {
      locationPathName = window.location.pathname;
      setup();
    } else {
      locationPathName = '';
    }
  }

  requestAnimationFrame(checkTrigger);
}

function setup() {
  const div = document.createElement('div');
  div.id = 'custom-btn-container';
  div.className = 'with-clean';

  const replyBtn = createReplyButton();
  const cleanButton = createCleanButton();

  cleanButton.addEventListener('click', () => {
    removeAnswersContainer();
  });

  div.appendChild(replyBtn);
  div.appendChild(cleanButton);

  const actionsButtonContainer = getActionBtnContainer();
  actionsButtonContainer.prepend(div);
}

async function onClickReply(event: Event) {
  const target = event.target as HTMLButtonElement;

  try {
    event.preventDefault();
    event.stopPropagation();

    target.textContent = 'Loading';
    target.disabled = true;
    await generateAnswers();
    target.textContent = REPLY_BUTTON_NAME;
  } catch (error) {
    target.textContent = 'Try Again';
  }
  target.disabled = false;

  return false;
}

function getActionBtnContainer() {
  return document.querySelector('.msg-form__right-actions');
}

async function generateAnswers() {
  try {
    removeAnswersContainer();

    const messageElement = document.querySelector('.msg-s-message-list-content') as HTMLUListElement;
    const messageData = extractMessageDataFromList(messageElement);
    console.log(messageData);

    if (messageData && messageData.length) {
      const captureLocation = locationPathName;
      const intelacotr = document.getElementById('thread-detail-jump-target')?.textContent.trim();

      const answers: Choice[] = await generateResponse({ messages: messageData, interlocutorName: intelacotr });

      if (locationPathName === captureLocation) {
        const ul = await createUl(answers);
        const container = document.querySelector('.msg-s-message-list-container');
        container.appendChild(ul);
      }

      removeDefaultQuickReplies();
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function removeDefaultQuickReplies() {
  document.querySelector('.conversations-quick-replies')?.remove();
  document.querySelector('.msg-s-message-list__quick-replies-container')?.remove();
}

async function createUl(answers: Choice[]) {
  const ul = document.createElement('ul');
  ul.id = 'ul-answers';

  const answersCountSetting: number = await getStorageItem(ANSWERS_NUMBER_SETTINGS);

  answers.forEach((answer) => {
    const newListItem = createLiElement(answer.message.content, answersCountSetting);

    ul.appendChild(newListItem);
  });

  return ul;
}

function createLiElement(answer: string, answersCountSetting: number) {
  const newListItem = document.createElement('li');
  newListItem.style.margin = '8px';

  const button = createAnswerButton(answer);

  // Create a span element
  const span = document.createElement('span');

  if (answersCountSetting > 1) {
    span.innerHTML = answer.trunc(130);
  } else {
    span.innerHTML = answer;
  }

  button.appendChild(span);
  newListItem.appendChild(button);
  return newListItem;
}

function createAnswerButton(answer: string) {
  const button = document.createElement('button');
  button.className = 'answer-button';

  button.addEventListener('click', () => {
    const input = document.querySelector('.msg-form__contenteditable');
    input.querySelector('p').textContent = answer;

    input.dispatchEvent(new InputEvent('input', { data: answer, bubbles: true }));
  });
  return button;
}

function createReplyButton() {
  const button = document.createElement('button');
  button.id = 'ai-reply-btn';
  button.className = 'artdeco-button artdeco-button--1';
  button.textContent = REPLY_BUTTON_NAME;

  button.addEventListener('click', async (event) => {
    const cleanButton = document.getElementById('clean-button') as HTMLButtonElement;

    cleanButton.disabled = true;
    await onClickReply(event);

    cleanButton.disabled = false;
  });

  return button;
}

function createCleanButton() {
  const button = document.createElement('button');
  button.id = 'clean-button';
  button.className = 'artdeco-button artdeco-button--1';
  button.textContent = 'clean';
  button.disabled = true;

  button.addEventListener('click', async () => {
    removeAnswersContainer();
  });

  return button;
}

function removeAnswersContainer() {
  document.getElementById('ul-answers')?.remove();
}
