const dashboardButton = document.getElementById("dashboardButton");

dashboardButton.onclick = () => navigateToDashboard();

const watchingText = document.getElementById("watchingText");

chrome.storage.local.get(["switching"], function(data){
    if(data["switching"] == "on") {
        
        const reload = document.getElementById("reload");

        document.getElementById("mainIcon").src = "images/icon.png";
        
        reload.onclick = () => reloadBlur();
        
        showStatus();
        
    } else {
        document.getElementById("mainIcon").src = "images/icon_off.png";
        watchingText.innerHTML = "HateMeter is switched off";
    }
});

const icon = document.getElementById("imageDiv");
icon.onclick = function() {
    chrome.storage.local.get(["switching"], function(data){
        const newStatus = data["switching"] == "on" ? "off" : "on";
        console.log(newStatus);
        document.getElementById("mainIcon").src = newStatus == "on" ? "images/icon.png" : "images/icon_off.png"
        chrome.storage.local.set({ "switching":  newStatus});
        if(newStatus == "on") {
            reloadBlur();
            showStatus();
        } else {
            chrome.tabs.reload();
            watchingText.innerHTML = "HateMeter is switched off";
        }
    });
}

function showStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var tab = tabs[0];
        var url = new URL(tab.url)
        watchingText.innerHTML = "Watching hates " + url.hostname;
        // `domain` now has a value like 'example.com'
    });
}


function reloadBlur() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currTab = tabs[0];
        chrome.scripting.executeScript({ 
            target: {tabId: currTab.id, allFrames: true}, 
            files: ["test.js"],
        });
    });
}

function navigateToDashboard() {
    chrome.tabs.update({
        url: "https://github.com/mtu4554/chrome-extension"
   });
}
