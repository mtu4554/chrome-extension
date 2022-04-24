document.getElementsByTagName("head")[0].innerHTML += '<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">'


var forbidden = ["DOCUMENT", "SCRIPT", "STYLE"]
var forbiddenChars = "/[]{}<>!@#$%^&*()".split("")
function iterateOverDom(element, array){
    for (let i = 0; i < element.children.length; i++) {
        text = getDirectLastText(element.children[i]).trim().replaceAll("  ", "").replaceAll("\t", "");
        
        forbiddenChars.forEach(element => {
            text.replaceAll(element, "");
        });

        //console.log( element.tagName)
        if(text.length > 0 &&  !forbidden.includes(element.tagName)){
            //element.children[i].id = makeid(7);
            object = {
                "id": getSelector(element.children[i]),//element.children[i].id,
                "text": text,
                "blured": false,
                "sent": false
            }

            array.push(object);

        }
        array = iterateOverDom(element.children[i], array)
    }

    return array
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
        charactersLength));
    }
    return result;
}

function getSelector(element)
{
    if (element.tagName === "BODY") return "BODY";
    const names = [];
    while (element.parentElement && element.tagName !== "BODY") {
        if (element.id) {
            names.unshift("#" + element.getAttribute("id"));
            break; 
        } else {
            let c = 1, e = element;
            for (; e.previousElementSibling; e = e.previousElementSibling, c++) ;
            names.unshift(element.tagName + ":nth-child(" + c + ")");
        }
        element = element.parentElement;
    }
    return names.join(">");
}

function getDirectLastText(ele) {
    var txt = "";
    [].forEach.call(ele.childNodes, function (v) {
        if (v.nodeType == 3) txt += v.textContent.replace(/^\W*\n/, '');
    });
    return txt;
}

function filterData(dataArray){
    output = [];

    dataArray.forEach(element => {
        if(element.length() > 0){
            output.push(element)
        }
    });

    return output;
}

var wordList = iterateOverDom(document.body, []);
// console.log(wordList)


function blurElements() {
    const blured = "color: transparent; text-shadow: 0 0 8px #000;";

    let popup;
    let unBluredElement;
    
    wordList.forEach(object => {
        var element = null;
        try {
            element = document.querySelector(object.id);
        } catch(e) {
            
        }

        console.log(object.blured);
        if(element != null && object.blured) {
            const style = element.style;
            element.style = blured;

            element.addEventListener("mouseenter", function(event) {
                
                element.style = "color: transparent; text-shadow: 0 0 8px #000;"
                  
                try {
                    const oldPopup = document.getElementById("popup");
                    document.body.removeChild(oldPopup);
                } catch(e) {
                }

                const rect = element.getBoundingClientRect();

                const topPosition = rect.top < 50 ? 0 : rect.top - 50;

                
                const html = "<div style=\"font-size: 15px; color: black\">Pozor ! Tento text môže obsahovať nenávistný obsah.</div>";
                popup = document.createElement("div");//(rect.top - 100)event.pageX
                popup.wmode = "transparent";
                popup.style = "display: block; position: fixed; z-index: 4000000; top: " + topPosition +
                                "px; left: " + event.pageX + "px; background-color: white; " +
                                "border-radius: 10px; padding: 10px; box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;";
                popup.innerHTML = html;
                popup.id = "popup";
                document.body.appendChild(popup);
                unBluredElement = element;
                element.style = style;
            });

            element.addEventListener("mouseleave", function() {
                try {
                    element.style = blured;
                    const oldPopup = document.getElementById("popup");
                    document.body.removeChild(oldPopup);
                } catch(e) {
                } 
            });
        }
    });
}

async function sendForEvaluation(data){
    // post
    let url = window.location.href;
    notsent = []
    wordList.forEach(element => {
        if(element.sent === false){
            notsent.push(element);
        }
    });
    toSend = [];

    notsent.forEach(element => {
   
            toSend.push(element.text.replaceAll(/[^\x00-\x7F]/g, ""));
      

    });
  
    var port = chrome.runtime.connect({
        name: "Sample Communication"
    });

    port.postMessage({msg:
        '{"url_address":'+ window.location.href +','+
        ' "title":'+ document.title +','+
        ' "text":'+ JSON.stringify(toSend) + '}', dataSend: toSend});
    port.onMessage.addListener(function(msg) {
        console.log("message recieved in test: " + msg.output);
        console.log(msg);
        for(var i = 0; i < notsent.length; i++){

            console.log(msg.output.sequence[i]);
            notsent[i].blured =  msg.output.sequence[i] == "negative" ? true : false;
            notsent[i].sent = true;
            
        }

        wordList = mergeLists( notsent,wordList);
        // console.log(wordList)
        // console.log("//////////////");
        // console.log(notsent)
        // console.log("updated!!!");

    });
}

function mergeLists(first, second){
    output = [];
    for(var i = 0; i < second.length;i++){
        for(var j = 0; j < first.length;j++){
            if(first[j].id === second[i].id && first[j].sent == true){
                output.push(first[j])
                break;
            }else{
                output.push(second[i]);
                break;
            }
        };
    };

    return output;
}

let isUpdated = false;
// console.log("you shouldn't be here!");
//on scroll -> ud = true

document.addEventListener("scroll", function(e){
    // console.log("uuweee!");
    isUpdated = false;
})

setInterval(() => {
    if(!isUpdated){
        // console.log("resized" + isUpdated);
        wordList = mergeLists(wordList, iterateOverDom(document.body, []));
        // console.log(wordList);
        sendForEvaluation(wordList);
        console.log(wordList);
        blurElements();
    }
    isUpdated = true;
    // console.log(isUpdated);
}, 2000);



    // console.log(document);

// const myList = document.body.innerText.split('\n');
// console.log(myList);

