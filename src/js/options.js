document.getElementById('apiKeySaveButton').addEventListener('click', function saveAPIKey() {
    const apiKey = document.getElementById('apiKey').value;
    console.log(apiKey);
    chrome.storage.sync.set({'apiKey': apiKey}, function() {
        console.log('API Key saved');   
    })
})