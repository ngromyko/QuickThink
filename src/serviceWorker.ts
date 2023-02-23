import { AppStorage, SelectedOption } from './models';
import { initializeStorageWithDefaults } from './storage';

const CLEAR_ANSWERS_TITLE = 'Clear answers';

chrome.runtime.onInstalled.addListener(async (details) => {
  const defaultStorageData: AppStorage = {
    selectedOption: SelectedOption.smartReplies,
    PROMT_SETTINGS: '',
    ANSWERS_NUMBER_SETTINGS: 1
  };
  await initializeStorageWithDefaults(defaultStorageData);

  const linkedInQuery = { url: 'https://www.linkedin.com/*' };
  chrome.tabs.query(linkedInQuery, refreshPage);

  if (details.reason == chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.openOptionsPage();
  }

  chrome.contextMenus.create({
    id: '1',
    title: CLEAR_ANSWERS_TITLE,
    documentUrlPatterns: [linkedInQuery.url],
  });
  chrome.contextMenus.create({
    id: '2',
    title: 'Options',
    documentUrlPatterns: [linkedInQuery.url],
  });
});

const refreshPage = (tabs: chrome.tabs.Tab[]) => {
  chrome.tabs.reload(tabs[0].id);
};

const clearAnswers = (tab: chrome.tabs.Tab) => {
  chrome.scripting.executeScript({
    target: {
      tabId: tab.id,
    },
    func: () => document.getElementById('ul-answers')?.remove(),
  });
};

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == '1') {
    clearAnswers(tab);
  }

  if (info.menuItemId == '2') {
    chrome.runtime.openOptionsPage();
  }
});
