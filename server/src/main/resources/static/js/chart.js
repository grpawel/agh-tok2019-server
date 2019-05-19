function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function mockData(){
    var data = [];
    var i;
    for(i = 0; i<20; i++) {
        data.push({
            score: 10*Math.random(),
            userName: "User" + (i+1),
            color: getRandomColor()
        })
    }
    return data;
}

function getResults(roomId) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/' + roomId + '/results', false);
    xhr.send(null);
    return JSON.parse(xhr.responseText);

}
function prepareData(roomId) {
     var results = getResults(roomId);
    // var results = mockData();

    var array = [];

    for (var result of results) {
        let item = {};
        let len = 8;
        if(result.userName.length > len) {
            item.label = result.userName.substring(0, len) + '...'; <!-- dont want to display too long name-->
        } else {
            item.label = result.userName;
        }
        item.y = Math.round(result.score * 100) / 100;
        item.color = result.color;
        array.push(item);
    }
    array.sort(function (a, b) {
        if(b.y !== a.y) return b.y - a.y;
        return a.label < b.label;
    });

    // for (var i = 0; i < array.length; i++) {
    //     var rank = array.filter(function(v) {return v > array[i].y}).length + 1;
    //     array[i].label =  rank + '. ' +  array[i].label;
    // }
    // console.log(array);
    var top = array.slice(0, 10);
    var rest = array.slice(10);
    return {
        "top": top,
        "rest": rest
    };
}
function getData() {
    var roomId = document.getElementById("roomID").innerHTML;
    return prepareData(roomId);
}
function createChart() {
    chart = new CanvasJS.Chart("chartContainer", {

        colorSet: "greenShades",

        // animationEnabled: true,

        // title:{
        //     text:"Wyniki"
        // },

        axisX:{
            viewportMinimum: -0.5,
            labelFontSize: 20,
            interval: 1
        },
        axisY2:{
            minimum: 0,
            viewportMinimum: 0,
            gridColor: "rgba(1,77,101,.1)",
            interval: 1,
            includeZero: true,
            title: "Punkty",
            labelFormatter: function (e) {
                return CanvasJS.formatNumber(e.value, "#.##");
            },
            labelFontSize: 24,
        },
        data: [{
            type: "bar",
            name: "users",
            axisYType: "secondary",
            dataPoints: getData().top.reverse()
        }]

    });
    return chart;
}
function showRest(rest){
    var list = document.getElementById("rest-list");
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    for(var result of rest){
        var li = document.createElement("li");
        li.setAttribute("class", "col-lg-1 col-md-1 col-sm-2 col-xs-2");
        var item = document.createElement("div");
        item.setAttribute("class", "item");
        var score = document.createTextNode(result.y.toFixed(2));
        var one = document.createElement("div");
        one.setAttribute("class", "one");
        var userName = document.createTextNode(result.label);
        one.appendChild(userName);
        item.style.borderColor = result.color;
        item.appendChild(one);
        var two = document.createElement("div");
        two.appendChild(score);
        two.setAttribute("class", "two");
        item.appendChild(two);
        li.appendChild(item);
        list.appendChild(li);
    }
}