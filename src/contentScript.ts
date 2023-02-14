import '../styles/content.scss';
import { getStorageItem, SelectedOption } from './storage';
import './string.extensions';

const API_KEY = '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';
const API_URL = 'https://api.openai.com/v1/completions';

const TEMPLATE = `{0} Respond in a friendly, concise and informal manner. Person: {1}. \n Answer:`;

const REPLY_BUTTON_NAME = 'AI Replies';
const GENERAL_COLOR = '#2cb52c';
const OPTIONS_NUMBER = 2;

let locationPathName = '';
function checkTrigger() {
  const messages = getMessages();

  if (locationPathName !== window.location.pathname && messages.length > 0) {
    locationPathName = window.location.pathname;

    const lastMessage = messages.slice(-1).toString().replace(/\s+/g, ' ');
    handle(lastMessage);
  }

  requestAnimationFrame(checkTrigger);
}

checkTrigger();

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

  const contentContainer = document.querySelector(
    '.msg-form__msg-content-container',
  );

  contentContainer.addEventListener('keydown', (e: any) => {
    if (e.key === 'Enter') {
      removeAnswersContainer();
    }
  });
}

function removeAnswersContainer() {
  document.getElementById('ul-answers')?.remove();
}

async function onClickReply(e: any, message: string) {
  try {
    e.preventDefault();
    e.stopPropagation();

    e.target.textContent = 'Loading';
    await generateAnswers(message);
    e.target.textContent = REPLY_BUTTON_NAME;
  } catch (error) {
    e.target.textContent = 'Try Again';
  }

  return false;
}

function getActionBtnContainer() {
  return document.querySelector('.msg-form__right-actions');
}

async function generateAnswers(lastMessage: any) {
  try {
    const model = await getModel();

    const allData = await generateResponse(
      lastMessage,
      180,
      OPTIONS_NUMBER,
      model,
    );
    // allData = [...new Set(allData)];

    document.getElementById('ul-answers')?.remove();

    const ul = createUl(allData);
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
  document
    .querySelector('.msg-s-message-list__quick-replies-container')
    ?.remove();
}

async function getModel() {
  let model = 'text-davinci-003';
  const selectedOption: SelectedOption = await getStorageItem('selectedOption');
  if (selectedOption == SelectedOption.quickReplies) {
    model = 'text-curie-001';
  }

  return model;
}

function createUl(answers: string[]) {
  const ul = document.createElement('ul');
  ul.id = 'ul-answers';
  ul.style.marginBottom = '5px';
  ul.style.marginTop = '5px';

  answers.forEach((answer) => {
    const newListItem = createLiElement(answer);

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
    document.querySelector('.msg-form__contenteditable p').textContent = answer;

    const textArea = document.querySelector('.msg-form__contenteditable');
    textArea.dispatchEvent(
      new InputEvent('input', { data: answer, bubbles: true }),
    );
  });
  return button;
}

function createReplyButton() {
  const button = document.createElement('button');
  button.id = 'IdRetrieveLastMessage';
  button.className = 'artdeco-button artdeco-button--1';
  button.style.marginRight = '5px';
  button.style.backgroundColor = GENERAL_COLOR;

  button.textContent = REPLY_BUTTON_NAME;

  return button;
}

function getMessages() {
  return Array.from(
    document.querySelectorAll('.msg-s-event-listitem__body'),
  ).map((msg) => msg.textContent);
}

const generateResponse = async (
  message: string,
  max_tokens = 200,
  count = 1,
  model = 'text-davinci-003',
) => {
  try {
    const promt = await getStorageItem('prompt');
    const formatedPromt = TEMPLATE.format(promt, message);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        prompt: formatedPromt,
        temperature: 0.5,
        max_tokens: max_tokens,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        best_of: 3,
        n: count,
        stop: ['Recruiter:', 'Answer:'],
      }),
    });
    const json = await response.json();
    return json.choices.map((x: any) => x.text);
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while generating the response');
  }
};
