const timerVar = setInterval(countTimer, 1000);
var config_endpoint = "/match-game/config";
var postScore_endpoint = "/match-game/end";
var totalSeconds = 60;

main();

function main(){
    getJSON(config_endpoint, afterConfigFetched);
}

function countTimer() {
   --totalSeconds;
    let seconds = totalSeconds;
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    if (totalSeconds < 1) {
        document.getElementById("timer").innerHTML = '00:00' + ":" + '00 s';
        postScoreJson(postScore_endpoint, 0);
    } else {
        document.getElementById("timer").innerHTML = '00:00' + ":" + seconds + ' s';
    }
}
    
function reloading() {
    const div = document.getElementById("divequation");
    div.innerHTML = '';
    divequation();
    draw_equation(equations[eq_num].first, equations[eq_num].op, equations[eq_num].sec, equations[eq_num].res);
    moves_mode(equations[eq_num].mode, equations[eq_num].sol[0].length);
    modal.style.display = "none";
}

function storeData (age) {
    const eq = generateEquationNumber(age);
    sessionStorage.setItem("eq_no", eq);
    eq_num = sessionStorage.getItem("eq_no");
    divequation();
    draw_equation(equations[eq_num].first, equations[eq_num].op, equations[eq_num].sec, equations[eq_num].res);
    moves_mode(equations[eq_num].mode, equations[eq_num].sol[0].length);
    createHint();
}

function compute_score() {
    const game_time = 60 - totalSeconds;
    if (game_time < 10) {
        return 1;
    } if (game_time > 60) {
        return 0;
    } else {
        return -0.014 * game_time + 1.14
    }
}

function getJSON(link, callback) {
    const xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', link, false);
    xobj.send(null);
    callback(xobj.responseText);
}

function afterConfigFetched(configJSON){
    window.name = configJSON;
    var data = JSON.parse(window.name);
    storeData(data['age']);
}

function postScoreJson(link, score) {
    const data = JSON.parse(window.name);

    const xobj = new XMLHttpRequest();
    xobj.open('POST', link, true);
    xobj.overrideMimeType("application/json");
    xobj.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xobj.withCredentials = true;

    xobj.onreadystatechange = function() {
        if (xobj.readyState === 4 && xobj.status === 200) {
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
    xobj.send(sentPayload);
}

countTimer();
