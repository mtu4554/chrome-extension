
let dashboardButton = document.getElementById("dashboardButton");

dashboardButton.onclick = () => navigateToDashboard();


function navigateToDashboard() {
    chrome.tabs.update({
        url: "https://github.com/mtu4554/chrome-extension"
   });
}
