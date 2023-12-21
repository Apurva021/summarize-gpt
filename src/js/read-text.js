let all_elements = document.querySelectorAll("p, span");
let text = "";
// let text = '';
all_elements.forEach(function (element) {
  text += element.textContent;
});
console.log(text);
console.log("text data logged");

chrome.runtime.sendMessage({'action': 'read-text' ,textData: text})
