const SEND_BUTTON_CLASS = '.msg-form__send-button';
const CONTENT_CONTAINER_CLASS = '.msg-form__msg-content-container';
const INPUT_CLASS = '.msg-form__contenteditable';

export const addSendButtonListener = (): void => {
  const sendButton = document.querySelector(SEND_BUTTON_CLASS) as HTMLButtonElement;

  if (sendButton) {
    sendButton.addEventListener('click', onSendButtonClick);
  } else {
    const contentContainer = document.querySelector(CONTENT_CONTAINER_CLASS) as HTMLElement;
    contentContainer?.addEventListener('keydown', onEnterPress);
  }
};

const onSendButtonClick = (): void => {
  removeAnswersContainer();
};

const onEnterPress = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    const input = document.querySelector(INPUT_CLASS) as HTMLElement;
    if (input && input.textContent?.trim()) {
      removeAnswersContainer();
    }
  }
};

const removeAnswersContainer = (): void => {
  document.getElementById('ul-answers')?.remove();
};
