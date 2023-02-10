// Get the options elements
const quickReplies = document.getElementById("quickReplies");
const smartReplies = document.getElementById("smartReplies");

 chrome.storage.local.get(["selectedOption"]).then((result) => {
  if (result.selectedOption === "quickReplies") {
    quickReplies.className = "selected";
    smartReplies.className = "";
  }else{
    quickReplies.className = "";
    smartReplies.className = "selected";
  }
});



// Handle option selection
quickReplies.addEventListener("click", function () {
  console.log("click");

  quickReplies.classList.add("selected");
  smartReplies.classList.remove("selected");

  const value = "quickReplies";

  chrome.storage.local.set({ selectedOption: value }).then(() => {
    console.log("Value is set to " + value);
  });
});

smartReplies.addEventListener("click", function () {
  const value = "smartReplies";

  smartReplies.classList.add("selected");
  quickReplies.classList.remove("selected");
  //localStorage.setItem("selectedOption", "smartReplies");
  chrome.storage.local.set({ selectedOption: value }).then(() => {
    console.log("Value is set to " + value);
  });
});
