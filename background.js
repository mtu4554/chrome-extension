let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ color });
    console.log('Default background color set to %cgreen', `color: ${color}`);
});

const data = { username: 'example' };

chrome.tabs.onUpdated.addListener(function (tabId) {
    console.log(tabId);
    chrome.storage.local.get(["switching"], function(data){
        if(data["switching"] == "on") {
            chrome.scripting.executeScript({ 
                target: {tabId: tabId, allFrames: true}, 
                files: ["test.js"],
            });
            chrome.scripting.executeScript({ 
                target: {tabId: tabId, allFrames: true}, 
                files: ["hateful_op.js"],
            });
        }
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


chrome.runtime.onMessage.addListener(

    function(request, sendResponse) {

    var url = 'http://sudoisbloat.pythonanywhere.com/get_para_get/' + request.jsonData;
    console.log(url);

    fetch(url) .then(response => console.log(response.json())).then(
        ()=> chrome.extension.sendRequest({method: 'addToMasterTicker', data:amount}, function(response) {}
    ));

  
    // chrome.runtime.sendMessage({'dummydata':"yes"});
 	// 	//sendResponse("hey")  


    return true;
});

chrome.runtime.onConnect.addListener(function(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(datas) {
        console.log(datas);
    //     var url = 'http://sudoisbloat.pythonanywhere.com/get_para_get/' + msg;
    //     console.log(url);
    
    
    //fetch(url).then(response => console.log(response.text()) //.then(response =>  //
     fetch("http://sudoisbloat.pythonanywhere.com/get_para", {
        method: 'POST',
        mode:'no-cors',
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           },
        body: datas.msg
    }).then(response => response.json()).then(data=>{
        console.log(data);
        // chrome.extension.sendRequest({method: 'addToMasterTicker', data:amount}, function(response) {});
        port.postMessage({ output: data, input: datas.dataSend});
    });

   
    
        
    });
});