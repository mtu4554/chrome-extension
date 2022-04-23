let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ color });
    console.log('Default background color set to %cgreen', `color: ${color}`);
});

const data = { username: 'example' };

chrome.tabs.onActivated.addListener(function( activeInfo) {
    console.log(activeInfo.tabId);
    chrome.scripting.executeScript({ 
        target: {tabId: activeInfo.tabId, allFrames: true}, 
        files: ["test.js"],
    });
    chrome.scripting.executeScript({ 
        target: {tabId: activeInfo.tabId, allFrames: true}, 
        files: ["hateful_op.js"],
    });
    // chrome.tabs.sendMessage(activeInfo.tab.id, {text: 'report_back'}, doStuffWithDom);
});

// fetch('https://example.com/profile', {
//   method: 'POST', // or 'PUT'
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(data),
// })
// .then(response => response.json())
// .then(data => {
//   console.log('Success:', data);
// })
// .catch((error) => {
//   console.error('Error:', error);
// });

// fetch("dismounted.space", {
//     method: "GET"
// }).then(response => response.json);

