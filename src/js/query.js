let text = "";

chrome.runtime.sendMessage({ action: "popup" });

const element = document.getElementById("summary");

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  console.log("response from background received");
  if (request.action == "background") {
    text = request.text;

    console.log(text);

    let prompt = "For the text given below within the braces [] provide a concise and comprehensive summary. The summary should capture the main points and key details of the text while conveying the author's intended meaning accurately. Ensure that the summary is well organized and easy to read, with cleat headings and sub headings to guide the reader through each section. The length of the summary should be appropriate to capture the main points and key details of the text, without including unnecessary information or becoming overly long. The response will be displayed within a div element of html. So return the summary in html format. Use tags for list and headint to organize the summary\n [ ";

    prompt = prompt.concat(text);
    prompt = prompt.concat(" ]");

    console.log(prompt);

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

    // check yt video about how to use the google gemini rest API.
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCqrlSDkL6Omy4IMYNbgTQlmIXYJ3t4COM", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    })

    
    // console.log(response);
    const summary = await response.json();
    // console.log(summary);
    // console.log("response from openai:");
    console.log(summary.candidates[0].content.parts[0].text);
    
    // console.log("innerhtml set");
    element.innerHTML = summary.candidates[0].content.parts[0].text;

    //now we can use the text data received to call the LLM model and get the summary of the page
    //we can use fetch.then() API to get the summary
    //and then we can set the summary using the innerHTML function.

  }
});


