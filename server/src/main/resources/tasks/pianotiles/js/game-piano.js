$('#startbutton').on("click", () => {
   // reset();
    game();
});

$(".ok-button").on("click", () => {
    $(".modal-background").hide();
});


const maxNoOfTiles = 100;
var score = 0;
var previousLane = 0;
var generatedBlacks = 0;
var gameOverFlag = false;
var interval;
var checkInterval;
var animationDuration;
var genTileTimeout;


var bottomLine = $("#lane0")[0].offsetHeight;

$('.lane').on("click", function () {
    if(!gameOverFlag)
        gameOver();
});

function generateTiles() {
    if(generatedBlacks < maxNoOfTiles) {
        let laneNo = Math.trunc(Math.random() * 3);
        if (previousLane === laneNo) {
            laneNo = Math.round(Math.random() * laneNo);
        }

        previousLane = laneNo;
        let lane = $('#lane' + laneNo);

        $(lane).prepend("<div class='black' style= 'background-color: black; width: 100%;height: 25%; position: absolute; top: 0px'></div>");
        generatedBlacks++;
        let child = $(lane).children().first()[0];
        const length = lane[0].offsetHeight - child.offsetHeight;
        $(child).on("click", function (e) {
            score++;
            if(score === maxNoOfTiles) {
                gameOver();
            }
            $(".score").html((maxNoOfTiles - score).toString());
            $(this).stop();
            $(this).remove();
            e.preventDefault();
            e.stopPropagation();
        });
        $(child).animate({top: '+=' + length}, {duration: animationDuration, easing: 'linear'});
    }
}


function checkIfGameOver() {
    let blacks = $(".black");
    let max = 0;
    let idx = 0;
    for (let i = 0; i < blacks.length; i++) {
        let top = blacks[i].offsetTop;
        if (top > max) {
            max = top;
            idx = i;
        }
    }
    if (max + blacks[idx].offsetHeight >= bottomLine) {
        gameOver();
    }
}

function game() {
    if (config['age'] <  8) {
        animationDuration = 3000;
        genTileTimeout = 950;
    } else if (config['age'] < 15) {
        animationDuration = 2000;
        genTileTimeout = 700;
    } else {
        animationDuration = 1200;
        genTileTimeout = 400;
    }
    interval = window.setInterval(generateTiles, genTileTimeout);
    checkInterval = window.setInterval(checkIfGameOver, 100);
}


function gameOver() {
    $('.black').stop();
    $('#startbutton').html("KONIEC GRY");
    $("#startbutton").off();
    $(".black").off();
    window.clearInterval(interval);
    window.clearInterval(checkInterval);
    sendResult(score/maxNoOfTiles);
}

function reset() {
    gameOverFlag = false;
    score = 0;
    generatedBlacks = 0;
    previousLane = 0;
    $(".score").html(maxNoOfTiles.toString());
   // $('#startbutton').html("START");
    $(".black").remove();
    generateTiles();
}
