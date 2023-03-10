import { Message } from '../models';
import { createButton } from './actionsButton';

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

export function extractMessageDataFromList(ulElement: HTMLUListElement): Message[] {
  const listItems: Message[] = [];

  const liElements = ulElement.querySelectorAll('li');

  liElements.forEach((liElement) => {
    const messageElement = liElement.querySelector('.msg-s-event-listitem');
    if (messageElement) {
      const contentElement = messageElement.querySelector('.msg-s-event-listitem__body');
      const isOther = messageElement.classList.contains('msg-s-event-listitem--other');
      const role = isOther ? 'user' : 'assistant';

      if (contentElement) {
        const content = contentElement.textContent.trim();
        listItems.push({ content, role });
      }
    }
  });

  return listItems;
}

export function removeDefaultQuickReplies() {
  document.querySelector('.conversations-quick-replies')?.remove();
  document.querySelector('.msg-s-message-list__quick-replies-container')?.remove();
}

export const createCustomButtonsContainer = () => {
  const { replyBtn, cleanBtn } = createButton();

  const customButtonContainer = document.createElement('div');
  customButtonContainer.id = 'custom-btn-container';
  customButtonContainer.className = 'with-clean';

  customButtonContainer.append(replyBtn, cleanBtn);

  const actionsButtonContainer = getActionsButtonContainer();
  actionsButtonContainer?.prepend(customButtonContainer);
};

export const removeCustomButtonsContainer = (): void => {
  document.getElementById('custom-btn-container')?.remove();
};

export const getActionsButtonContainer = (): HTMLElement | null => {
  return document.querySelector('.msg-form__right-actions');
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
