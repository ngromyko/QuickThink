import { initializeStorageWithDefaults, SelectedOption } from './storage';

chrome.runtime.onInstalled.addListener(async () => {
  // Here goes everything you want to execute after extension initialization

  const defaultStorageData = { selectedOption: SelectedOption.smartReplies };
  await initializeStorageWithDefaults(defaultStorageData);

  const query = { url: "https://www.linkedin.com/*" };
  chrome.tabs.query(query, refreshPage());
});

// Log storage changes, might be safely removed
chrome.storage.onChanged.addListener((changes) => {
  for (const [key, value] of Object.entries(changes)) {
    console.log(
      `"${key}" changed from "${value.oldValue}" to "${value.newValue}"`,
    );
  }
});

const refreshPage = () => {
  return function (tabs: chrome.tabs.Tab[]) {
    chrome.tabs.reload(tabs[0].id);
  };
};