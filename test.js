var forbidden = ["DOCUMENT", "SCRIPT", "STYLE"]

function iterateOverDom(element, array){
    for (let i = 0; i < element.children.length; i++) {
        text = getDirectLastText(element.children[i]).trim().replaceAll("  ", "").replaceAll("\t", "");
        //console.log( element.tagName)
        if(text.length > 0 &&  !forbidden.includes(element.tagName)){
            //element.children[i].id = makeid(7);
            object = {
                "id": getSelector(element.children[i]),//element.children[i].id,
                "text": text,
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

function sendForEvaluation(data, url){
    // post
}


var wordList = iterateOverDom(document.body, []);
console.log(wordList)


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

        if(element != null) {
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
                console.log(rect.top);

                
                const html = "<h1>Word</h1>";
                popup = document.createElement("div");
                popup.style = "position: fixed; z-index: 100; margin-top: " + (rect.top - 100) + 
                                "px; margin-left: " + event.pageX + "px; background-color: white; " +
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


let isUpdated = false;
console.log("you hsouldnt be here");
//on scroll -> ud = true

document.addEventListener("scroll", function(e){
    console.log("uuweee!");
    isUpdated = false;
})

setInterval(() => {
    if(!isUpdated){
        console.log("resized" + isUpdated);
        wordList = iterateOverDom(document.body, []);
        console.log(wordList);
        blurElements();
    }
    isUpdated = true;
    console.log(isUpdated);
}, 2000);

    // console.log(document);

// const myList = document.body.innerText.split('\n');
// console.log(myList);

