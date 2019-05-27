var config_endpoint = "/snake/config"
var postScore_endpoint = "/snake/end"

function main() {
    getJSON(config_endpoint, afterConfigFetched);
}

function getJSON(link, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', link, false);
    xobj.send(null);
    callback(xobj.responseText);
}

function afterConfigFetched(configJSON) {
    console.log("Got response: " + configJSON);
    window.name = configJSON
}

function sendScoreAndReturnControl(score) {
    var adapterData = JSON.parse(window.name);
    postScoreJson(postScore_endpoint, score);
}

function getSpeed() {
    var age = JSON.parse(window.name)["age"];
    var speed = Math.round(age / 5);
    if (speed > 5) {
        return 5;
    }
    if (speed < 3) {
        return 3;
    }
    return speed;
}

function getInterval() {
    var age = JSON.parse(window.name)["age"];
    if (age < 5)
        return 7;
    if (age < 10)
        return 4;
    if (age < 15)
        return 2;
    return 1;
}

function getResult() {
    var age = JSON.parse(window.name)["age"];
    var result = Math.round(age / 1.6);
    if (result > 15) {
        return 15;
    }
    if (result < 7) {
        return 7;
    }
    return result;
}

function postScoreJson(link, score) {
    var data = JSON.parse(window.name);

    var xobj = new XMLHttpRequest();
    xobj.open('POST', link, true);
    xobj.overrideMimeType("application/json");
    xobj.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xobj.withCredentials = true

    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && xobj.status === 200) {
            console.log(xobj.responseText)
            window.location = xobj.responseText
        }
    };

    var sentPayload =
        JSON.stringify(
            {
                group: data["group"],
                nick: data["nick"],
                age: data["age"],
                result: score
            }
        );
    console.log("Sending: " + sentPayload);
    xobj.send(sentPayload);
}

