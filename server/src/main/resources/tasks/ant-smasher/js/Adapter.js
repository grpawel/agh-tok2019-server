var config_endpoint = "/ant-smasher/config"
var postScore_endpoint = "/ant-smasher/end"
var age

function fetchConfig() {
    getJSON(config_endpoint, afterConfigFetched)
}

function getJSON(link, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', link, false);
    xobj.send(null);
    callback(xobj.responseText);
}

function afterConfigFetched(configJSON){
    console.log("Got response: " + configJSON);
    window.name = configJSON
    age = JSON.parse(window.name)["age"];
}


function sendScoreAndReturnControl(score){
    var adapterData = JSON.parse(window.name);
    postScoreJson(postScore_endpoint, score);
}

function postScoreJson(link, score) {
    var data = JSON.parse(window.name);

    var xobj = new XMLHttpRequest();
    xobj.open('POST', link, true);
    xobj.overrideMimeType("application/json");
    xobj.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xobj.withCredentials = true

    xobj.onreadystatechange = function() {
        if (xobj.readyState === 4 && xobj.status === 200) {
            console.log(xobj.responseText)
            window.location = xobj.responseText
        }
    };

    var sentPayload =
        JSON.stringify(
            {
                group : data["group"],
                nick : data["nick"],
                age : data["age"],
                result: score
            }
        );
    console.log("Sending: " + sentPayload);
    xobj.send(sentPayload);
}


