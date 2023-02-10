const REPLY_BUTTON_NAME = "AI Replies";
const GENERAL_COLOR = "#2cb52c";
const OPTIONS_NUMBER = 2;

var locationPathName = "";
function checkTrigger() {
  const messages = getMessages();

  if (locationPathName !== window.location.pathname && messages.length > 0) {
    locationPathName = window.location.pathname;

    const lastMessage = messages.slice(-1).toString().replace(/\s+/g, " ");
    handle(lastMessage);
  }

  requestAnimationFrame(checkTrigger);
}

checkTrigger();


function handle(message) {
  if (message) {
    removeAnswersContainer();

    const actionsButtonContainer = getActionBtnContainer();
    document.getElementById("IdRetrieveLastMessage")?.remove();
    const replyBtn = createReplyButton();

    replyBtn.addEventListener("click", async (e) => {
      await onClickReply(e, message);
    });

    setupSendButton();

    const div = document.createElement("div");
    div.appendChild(replyBtn);

    actionsButtonContainer.prepend(div);
  }
}

function setupSendButton() {
  var sendBtn = document.querySelector(".msg-form__send-button");
  sendBtn.addEventListener("click", async () => {
    removeAnswersContainer();
  });
}

function removeAnswersContainer() {
  document.getElementById("ul-answers")?.remove();
}

async function onClickReply(e, message) {
  try {
    e.target.textContent = "Loading";
    await generateAnswers(message);
    e.target.textContent = REPLY_BUTTON_NAME;
  } catch (error) {
    e.target.textContent = "Try Again";
  }
}

function getActionBtnContainer() {
  return document.querySelector(".msg-form__right-actions");
}

async function generateAnswers(lastMessage) {
  try {
    let model = await getModel();

    let allData = await globalThis.generateResponse(
      lastMessage,
      180,
      OPTIONS_NUMBER,
      model
    );
    allData = [...new Set(allData)];

    document.getElementById("ul-answers")?.remove();

    const ul = createUl(allData);
    const container = document.querySelector(".msg-s-message-list-container");
    container.appendChild(ul);

    document.querySelector(".conversations-quick-replies")?.remove();
    document
      .querySelector(".msg-s-message-list__quick-replies-container")
      ?.remove();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getModel() {
  let model = "text-davinci-003";
  await chrome.storage.local.get(["selectedOption"]).then((result) => {
    if (result.selectedOption === "quickReplies") {
      model = "text-curie-001";
    }
  });
  return model;
}

function createUl(answers) {
  const ul = document.createElement("ul");
  ul.id = "ul-answers";
  ul.style.marginBottom = "5px";
  ul.style.marginTop = "5px";

  answers.forEach((answer) => {
    const newListItem = createLiElement(answer);

    ul.appendChild(newListItem);
  });

  return ul;
}

function createLiElement(answer) {
  const newListItem = document.createElement("li");
  newListItem.style.margin = "8px";

  const button = createAnswerButton(answer);

  // Create a span element
  const span = document.createElement("span");
  span.innerHTML = answer.trunc(150);

  button.appendChild(span);
  newListItem.appendChild(button);
  return newListItem;
}

function createAnswerButton(answer) {
  const button = document.createElement("button");
  button.className = "answer-button";

  button.addEventListener("click", () => {
    document.querySelector(".msg-form__contenteditable p").textContent = answer;

    var textArea = document.querySelector(".msg-form__contenteditable");
    textArea.dispatchEvent(
      new InputEvent("input", { data: answer, bubbles: true })
    );
  });
  return button;
}

function createReplyButton() {
  const button = document.createElement("button");
  button.id = "IdRetrieveLastMessage";
  button.classList = "artdeco-button artdeco-button--1";
  button.style.marginRight = "5px";
  button.style.backgroundColor = GENERAL_COLOR;

  button.textContent = REPLY_BUTTON_NAME;

  return button;
}

function getMessages() {
  return Array.from(
    document.querySelectorAll(".msg-s-event-listitem__body")
  ).map((msg) => msg.textContent);
}


String.prototype.trunc = function (n) {
  return this.substr(0, n - 1) + (this.length > n ? "&hellip;" : "");
};
