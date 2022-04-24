var input_els = document.querySelectorAll("input");
var editable = document.querySelectorAll("div>span");
var textAreas = document.querySelectorAll("textarea");

var array = [...input_els, ...editable, ...textAreas];

array.forEach(element => {
    element.onclick = warn;
    element.addEventListener("focusout", function () {

        try {
            const oldPopup = document.getElementById("popup");
            document.body.removeChild(oldPopup);
        } catch (e) {
        }

    });
});


var warn = (e) => {
    console.log(e);
    var element = e.target;

    if (element != null) {

        try {
            const oldPopup = document.getElementById("popup");
            document.body.removeChild(oldPopup);
        } catch (e) {
        }

        const rect = element.getBoundingClientRect();

        const topPosition = rect.top < 50 ? 0 : rect.top - 50;


        const html = "<div style=\"font-size: 15px; color: black\">V internetovom priestore sa vyjadrujte slušne</div>";
        popup = document.createElement("div");//(rect.top - 100)event.pageX
        popup.wmode = "transparent";
        popup.style = "display: block; position: fixed; z-index: 4000000; top: " + topPosition +
            "px; left: " + event.pageX + "px; background-color: white; " +
            "border-radius: 10px; padding: 10px; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;";
        popup.innerHTML = html;
        popup.id = "popup";
        document.body.appendChild(popup);

        console.log("something is happeninghjhuj");
    }
}




// inputs.forEach(element => {
//     inputs.addEventListener("onFocus", function(e){

//     })
// });


