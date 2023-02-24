import { Info } from '../models';

export const getInfo = (): Info => {
  const lastOtherMsgBlock = Array.from(document.querySelectorAll('.msg-s-event-listitem--other')).slice(-1)[0];
  const nameElement = document.getElementById('thread-detail-jump-target');

  if (lastOtherMsgBlock && nameElement) {
    const lastMessage = lastOtherMsgBlock.querySelector('.msg-s-event-listitem__body').textContent.trim();
    const name = nameElement.textContent.trim();

    return { message: lastMessage, name: name };
  }

  return null;
};
