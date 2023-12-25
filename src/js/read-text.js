function readText() {
  let all_elements = document.querySelectorAll("p, span");
  let text = "";
  all_elements.forEach(function (element) {
    text += element.textContent;
  });

  chrome.runtime.sendMessage({'action': 'read-text' ,textData: text})
}

readText();
