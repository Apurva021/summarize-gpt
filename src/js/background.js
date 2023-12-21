let text = '';

//background file keeps running at all time even when the extension is not clicked.
// we can use this for communication between the content-scripts and the popup.js
// popup.js means the script file that we are using for the main extension page.

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.action == 'read-text') {
        console.log('data received:');
        console.log(request);
        text = request.textData;
    } else if(request.action == 'popup'){
        console.log('popup request received');
        // need to check how the sendResponse function works.
        // can it directly reply with data to the requestor.
        // sendResponse({'action': 'background' ,'text': text})
        chrome.runtime.sendMessage({'action': 'background' ,'text': text})
    }
});
