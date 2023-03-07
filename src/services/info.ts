import { Message } from '../models';

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
