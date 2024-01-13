function readText() {
  let all_elements = document.querySelectorAll("p, span, table, pre, strong, h1,h2,h3,h4,h5,h6,em");
  let text = "";
  all_elements.forEach(function (element) {
    text += element.textContent;
  });

  chrome.runtime.sendMessage({'action': 'read-text' ,textData: text})
}

readText();
