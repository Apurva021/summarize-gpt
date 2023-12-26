let text = '';
let summaries = {}
//background file keeps running at all time even when the extension is not clicked.
// we can use this for communication between the content-scripts and the popup.js
// popup.js means the script file that we are using for the main extension page.

// this message listener handles messages from 2 sources: query.js (the js file of popup.html)
// and read-text.js(the content script which reads the currently active tab)
// if the message is from query.js we check if we already have the text from content script
// if the text is available we can send the text to query.js file
// if not then we inject the content script to the currently active tab in order to get the textContent

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.action == 'read-text') {
        text = request.textData;
        let apiKey =''; 
        chrome.storage.sync.get('apiKey', function(data) {
            if(data.apiKey) apiKey = data.apiKey
            chrome.runtime.sendMessage({'action': 'background' ,'text': text, 'apiKey': apiKey})
            text = '';
        })
    } else if(request.action == 'popup'){
        let activeTabUrl = undefined;
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            activeTabUrl = tabs[0]?.url;
            // although we have property tabs.id better to use tab.url as the key
            // bcuz for same tab id when the url changes our summary should be updated.
            if(summaries[activeTabUrl]) {
                console.log("summary found");
                chrome.runtime.sendMessage({action: 'summary-found', 'summary': summaries[activeTabUrl]})
            } else {
                console.log("summary not present script called.");
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id, allFrames: true},
                    files: ['src/js/read-text.js']
                });
            }
        });
    } else if(request.action == "summary-created") {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            let activeTabUrl = undefined;
            activeTabUrl = tabs[0]?.url;
            if(activeTabUrl) summaries[activeTabUrl] = request.summary;
        })
    }
});
