import '../styles/content.scss';
import * as answersService from './services/answers';
import {
  addSendButtonListener,
  createCustomButtonsContainer,
  getActionsButtonContainer,
  removeCustomButtonsContainer,
} from './services/messageForm';
import './utils/string.extensions';

let currentPathName = '';

const isConversationLoaded = (): boolean => {
  return getActionsButtonContainer() ? true : false;
};

const reset = (): void => {
  currentPathName = '';
};

const handleThreadChange = (): void => {
  if (isConversationLoaded()) {
    currentPathName = window.location.pathname;
    answersService.removeAnswersContainer();
    removeCustomButtonsContainer();

    createCustomButtonsContainer();
  } else {
    reset();
  }
};

const setupChatWindow = (): void => {
  if (window.location.pathname.includes('/messaging/thread/')) {
    addSendButtonListener();

    if (currentPathName !== window.location.pathname) {
      handleThreadChange();
    }
  } else {
    reset();
  }

  requestAnimationFrame(setupChatWindow);
};

setupChatWindow();

export { currentPathName };
