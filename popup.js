const dashboardButton = document.getElementById("dashboardButton");

dashboardButton.onclick = () => navigateToDashboard();

const watchingText = document.getElementById("watchingText");

var percentage = null;

chrome.storage.local.get(["switching"], function(data){
    if(data["switching"] == "on") {
        
        const reload = document.getElementById("reload");

        //document.getElementById("mainIcon").src = "images/icon.png";

        //document.getElementsByClassName("outerCircle")[0].style.setProperty("background-color", rgb(165, 39, 39));
        document.getElementById("triangle").style.setProperty("border-bottom", "80px solid red");
        
        reload.onclick = () => reloadBlur();
        
        showStatus();
        
    } else {
       // document.getElementsByClassName("outerCircle")[0].setProperty("background-color", "#a1a1a1");
        document.getElementById("triangle").style.setProperty("border-bottom", "80px solid #a1a1a1");
        watchingText.innerHTML = "HateMeter is switched off";
    }
});

const icon = document.getElementById("imageDiv");
icon.onclick = function() {
    chrome.storage.local.get(["switching"], function(data){
        const newStatus = data["switching"] == "on" ? "off" : "on";
        console.log(newStatus);

       
       // document.getElementById("mainIcon").src = newStatus == "on" ? "images/icon.png" : "images/icon_off.png"
        chrome.storage.local.set({ "switching":  newStatus});
        if(newStatus == "on") {
           // document.getElementsByClassName("outerCircle")[0].style.setProperty("background-color", rgb(165, 39, 39));
            document.getElementById("triangle").style.setProperty("border-bottom", "80px solid red");
            reloadBlur();
            showStatus();
        } else {
           // document.getElementsByClassName("outerCircle")[0].setProperty("background-color", "#a1a1a1");
            document.getElementById("triangle").style.setProperty("border-bottom", "80px solid #a1a1a1");
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
function getURL(){
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
        url: "https://telekomhk2022.firebaseapp.com/"
   });
}

function calculateInterval(response){
    var negative = response.negative_count == null ? 0 : response.negative_count; 
    var positive = response.positive_count == null ? 0 : response.positive_count; 
    console.log("pos" + positive + " neg " + negative);
    try{
        percentage = 100 * (negative / (negative + positive))
        console.log("percentage " + percentage);
        showPercentage(percentage)
    }catch(e){
        percentage = null;
    }

}

var intervalId = setInterval(() =>{

    try{

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var tab = tabs[0];
            var url = new URL(tab.url)
            var urlAddress = 'http://sudoisbloat.pythonanywhere.com/get-website-info/' +  url.hostname;
     
            fetch(urlAddress).then(response => response.json()).then(response => {
                console.log(response);
                if(response != null){
                    calculateInterval(response);
                // clearInterval(intervalId);
                }
        
            });
        });
       
    }catch(e){
        console.log(e);
    }
}, 3000);


showPercentage(0);

function showPercentage(value) {
    const percentage = document.getElementById("percentage");
    percentage.innerHTML = value == "NaN" ? "0" : value + "%";

    const rotator = document.getElementsByClassName("stickRotator")[0];
    console.log(180 + (value / 100) - 90 );

    if(value == "NaN" || value == 0) {
        rotator.style.transform = "rotate(-90deg);"
    }
    else rotator.style.transform = "rotate(" + (180 + (value / 100) - 90 ) + "deg)";

    /*const interval = setInterval(() => {
        percentage.innerHTML = currentValue + "%";
        currentValue++;
        if(currentValue > value) clearInterval(interval);
    }, 2000 / value);*/
}
