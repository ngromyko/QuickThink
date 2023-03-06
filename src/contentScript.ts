import '../styles/content.scss';
import { Choice } from './models';
import { generateResponse } from './services/api';
import { getInfo } from './services/info';
import './string.extensions';

const REPLY_BUTTON_NAME = 'AI Reply';

let locationPathName = '';

checkTrigger();
function checkTrigger() {
  modifyOriginalSendButton();

  if (locationPathName !== window.location.pathname) {
    const other = document.querySelector('.msg-s-event-listitem--other');

    removeAnswersContainer();
    document.getElementById('custom-btn-container')?.remove();

    if (other) {
      locationPathName = window.location.pathname;
      handle();
    } else {
      locationPathName = '';
    }
  }

  requestAnimationFrame(checkTrigger);
}

function handle() {
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

function modifyOriginalSendButton() {
  const sendBtn = document.querySelector('.msg-form__send-button');

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      removeAnswersContainer();
    });
  } else {
    const contentContainer = document.querySelector('.msg-form__msg-content-container');
    contentContainer?.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        const input = document.querySelector('.msg-form__contenteditable');

        if (input && input.textContent.trim()) {
          removeAnswersContainer();
        }
      }
    });
  }
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
    const info = getInfo();

    if (info) {
      const captureLocation = locationPathName;
      const answers: Choice[] = await generateResponse(info);
      //  const uniqueTexts = filterUnique(answers, 'message');

      if (locationPathName === captureLocation) {
        const ul = createUl(answers);
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

function createUl(answers: Choice[]) {
  const ul = document.createElement('ul');
  ul.id = 'ul-answers';

  answers.forEach((answer) => {
    const newListItem = createLiElement(answer.message.content);

    ul.appendChild(newListItem);
  });

  return ul;
}

function createLiElement(answer: string) {
  const newListItem = document.createElement('li');
  newListItem.style.margin = '8px';

  const button = createAnswerButton(answer);

  // Create a span element
  const span = document.createElement('span');
  span.innerHTML = answer.trunc(130);

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

function filterUnique<T>(arr: T[], key: keyof T): T[] {
  const uniqueItems: T[] = [];
  const lowercaseKeys = new Set<string>();

  for (const item of arr) {
    const lowercaseKey = String(item[key]).toLowerCase();
    if (!lowercaseKeys.has(lowercaseKey)) {
      uniqueItems.push(item);
      lowercaseKeys.add(lowercaseKey);
    }
  }

  return uniqueItems;
}
