var input_els = document.querySelectorAll("input");
var editable = document.querySelectorAll("div>span");

var array = [...input_els, ...editable];
console.log("something is happening" + array.length);

var warn = (e) => {
    alert("chod spat");
    console.log("something is happeninghjhuj");
}

array.forEach(element => {
    element.onclick = warn;
});




// inputs.forEach(element => {
//     inputs.addEventListener("onFocus", function(e){

//     })
// });


