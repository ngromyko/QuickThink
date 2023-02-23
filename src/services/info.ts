import { Info } from '../models';

export const getInfo = (): Info => {
  const lastOtherMsgBlock = Array.from(document.querySelectorAll('.msg-s-event-listitem--other')).slice(-1)[0];

  if (lastOtherMsgBlock) {
    const lastMessage = lastOtherMsgBlock.querySelector('.msg-s-event-listitem__body').textContent.trim();
    const name = lastOtherMsgBlock.querySelector('.msg-s-message-group__profile-link')?.textContent.trim() ?? 'Person';

    return { message: lastMessage, name: name };
  }

  return null;
};
