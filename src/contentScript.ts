import '../styles/content.scss';
import { Choice } from './models';
import { generateResponse } from './services';
import './string.extensions';

const REPLY_BUTTON_NAME = 'AI Replies';
const OPTIONS_NUMBER = 2;

let locationPathName = '';

checkTrigger();
function checkTrigger() {
  const messages = getMessages();

  if (locationPathName !== window.location.pathname && messages.length > 0) {
    locationPathName = window.location.pathname;

    const lastMessage = messages.slice(-1).toString().replace(/\s+/g, ' ');
    handle(lastMessage);
  }

  requestAnimationFrame(checkTrigger);
}

function handle(message: string) {
  if (message) {
    removeAnswersContainer();

    const actionsButtonContainer = getActionBtnContainer();
    document.getElementById('IdRetrieveLastMessage')?.remove();
    const replyBtn = createReplyButton();

    replyBtn.addEventListener('click', async (e) => {
      await onClickReply(e, message);
    });

    setupSendButton();

    const div = document.createElement('div');
    div.appendChild(replyBtn);

    actionsButtonContainer.prepend(div);
  }
}

function setupSendButton() {
  const sendBtn = document.querySelector('.msg-form__send-button');
  sendBtn?.addEventListener('click', () => {
    removeAnswersContainer();
  });

  const contentContainer = document.querySelector('.msg-form__msg-content-container');

  contentContainer.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      removeAnswersContainer();
    }
  });
}

async function onClickReply(event: any, message: string) {
  try {
    event.preventDefault();
    event.stopPropagation();

    event.target.textContent = 'Loading';
    await generateAnswers(message);
    event.target.textContent = REPLY_BUTTON_NAME;
  } catch (error) {
    event.target.textContent = 'Try Again';
  }

  return false;
}

function getActionBtnContainer() {
  return document.querySelector('.msg-form__right-actions');
}

async function generateAnswers(lastMessage: string) {
  try {
    const answers: Choice[] = await generateResponse(lastMessage, 160, OPTIONS_NUMBER);

    removeAnswersContainer();

    const ul = createUl(answers);
    const container = document.querySelector('.msg-s-message-list-container');
    container.appendChild(ul);

    removeDefaultQuickReplies();
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
    const newListItem = createLiElement(answer.text);

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
  span.innerHTML = answer.trunc(150);

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
  button.id = 'IdRetrieveLastMessage';
  button.className = 'artdeco-button artdeco-button--1';
  button.textContent = REPLY_BUTTON_NAME;

  return button;
}

function getMessages() {
  return Array.from(document.querySelectorAll('.msg-s-event-listitem__body')).map((msg) => msg.textContent);
}

function removeAnswersContainer() {
  document.getElementById('ul-answers')?.remove();
}
