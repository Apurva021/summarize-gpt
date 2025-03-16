let text = "";

// this message is to initiate the call from background to read-text
chrome.runtime.sendMessage({ action: "popup" });

const element = document.getElementById("summary");
const regenerateButton = document.getElementById("regenerate");

hideBtn()

function hideBtn() {
  regenerateButton.style.visibility = 'hidden'
}

function showBtn() {
  regenerateButton.style.visibility = 'visible'
}

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.action == "background") {
    text = request.text;
    let apiKey = request.apiKey  
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="+apiKey
    let prompt = "Could you please provide a summary of the text given in braces [], including all key points and supporting details? The summary should be comprehensive and accurately reflect the main message and arguments presented in the original text, while also being concise and easy to understand. To ensure accuracy, please read the text carefully and pay attention to any nuances or complexities in the language. Additionally, the summary should avoid any personal biases or interpretations and remain objective and factual throughout. Ensure that the summary is well organized and easy to read, with clear headings and sub headings to guide the reader through each section. The response should be in html format. The response is going to be displayed on a web browser within a div tag. Hence it is very important that you send the response in html tags and not in markdown. Format your response such that it is easy to view and understand. You can use different tags like headers, articles, lists, paragraphs, tables and other style and semantic html tags wherever required. Make use of formatting tags to make the final result easy to read, navigate and understand. [  "
    // "For the text given below within the braces [] provide a concise and comprehensive summary. The summary should capture the main points and key details of the text while conveying the author's intended meaning accurately. Ensure that the summary is well organized and easy to read, with cleat headings and sub headings to guide the reader through each section. The length of the summary should be appropriate to capture the main points and key details of the text, without including unnecessary information or becoming overly long. The response will be displayed within a div element of html. So return the summary in html format. Use tags for list and headint to organize the summary\n [ ";

    prompt = prompt.concat(text);
    prompt = prompt.concat(" ]");

    // console.log(prompt);

    let data = {
      "contents": [
        {
          "parts": [
            {
              "text": prompt
            }
          ]
        }
      ]
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    })

    // convert response to json;
    const summary = await response.json();
    if(summary?.error) {
      element.innerHTML = 'Save/Update the API key from options menu. Right click on the extension icon. Click on options. Follow the steps to configure the API key'
    } else {
      // console.log(summary.candidates[0].content.parts[0].text);
      element.innerHTML = summary.candidates[0].content.parts[0].text;
      showBtn();
      chrome.runtime.sendMessage({ action: "summary-created", "summary": summary.candidates[0].content.parts[0].text});
    }
    
  } else if(request.action == "summary-found") {
    element.innerHTML = request.summary;
    showBtn();
  }
});

document.getElementById('regenerate').addEventListener('click', function saveAPIKey() {
  chrome.runtime.sendMessage({ action: "regenerate" });
  element.innerHTML = 'Summary is Loading...'
  regenerateButton.style.visibility = 'hidden'
})