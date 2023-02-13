chrome.runtime.onInstalled.addListener(async () => {
  const query = { url: "https://www.linkedin.com/*" };
  chrome.tabs.query(query, refreshPage());
});

const refreshPage = () => {
  return function (tabs) {
    chrome.tabs.reload(tabs[0].id);
  };
};
