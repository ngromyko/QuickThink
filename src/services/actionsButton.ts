import { createAnswersContainer, removeAnswersContainer } from './answers';
import { removeDefaultQuickReplies } from './messageForm';

const REPLY_BUTTON_NAME = 'AI Reply';
const CLEAN_BUTTON_NAME = 'clean';

const REPLY_BUTTON_LOADING_TEXT = 'Loading';
const REPLY_BUTTON_TRY_AGAIN_TEXT = 'Try Again';

const createButton = () => ({
  replyBtn: createReplyButton(),
  cleanBtn: createCleanButton(),
});

const createReplyButton = () => {
  const button = document.createElement('button');
  button.id = 'ai-reply-btn';
  button.className = 'artdeco-button artdeco-button--1';
  button.textContent = REPLY_BUTTON_NAME;

  button.addEventListener('click', replyBtnOnclick);

  return button;
};

const replyBtnOnclick = async (event: Event) => {
  const cleanButton = document.getElementById('clean-button') as HTMLButtonElement;

  cleanButton.disabled = true;

  await onClickReply(event);

  cleanButton.disabled = false;
};

const createCleanButton = () => {
  const button = document.createElement('button');
  button.id = 'clean-button';
  button.className = 'artdeco-button artdeco-button--1';
  button.textContent = CLEAN_BUTTON_NAME;
  button.disabled = true;

  button.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    removeAnswersContainer();
  });

  return button;
};

const onClickReply = async (event: Event) => {
  const target = event.target as HTMLButtonElement;

  try {
    event.preventDefault();
    event.stopPropagation();

    target.textContent = REPLY_BUTTON_LOADING_TEXT;
    target.disabled = true;

    removeAnswersContainer();

    await createAnswersContainer();

    removeDefaultQuickReplies();

    target.textContent = REPLY_BUTTON_NAME;
  } catch (error) {
    target.textContent = REPLY_BUTTON_TRY_AGAIN_TEXT;
  }
  target.disabled = false;
};

export { createButton };
