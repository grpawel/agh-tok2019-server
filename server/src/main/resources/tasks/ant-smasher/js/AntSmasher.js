var bugs = [];

var score;
var totalClicks; // how many times the user has clicked (for accuracy)
var playing; // aids with asychronous endGame() function

var speed; // speed at which the bugs travel
var bugChance; // chance of a new bug being pushed

var upper;
var lower;
var start = false;
var antImg;
var waspImg;

//options
debug = false;

function preload() {
    fetchConfig()
    if (!debug) {
        antImg = loadImage('../img/ant-smasher/img/ant.png');
        waspImg = loadImage('../img/ant-smasher/img/wasp.png');
    }
}

function setup() {
    createCanvas(windowWidth * 0.95, windowHeight * 0.75);
    score = 0;
    totalClicks = 0;
    playing = true;

    lower = height / 100;
    upper = height / 50;
    console.log(age)
    if (age < 5) {
        lower *= 0.5;
        upper *= 0.5;
    }
    else if (age < 11) {
        lower *= 0.75;
        upper *= 0.75;
    }
    else if (age < 16) {
        lower *= 1;
        upper *= 1;
    }
    else if (age < 35) {
        lower *= 1.3;
        upper *= 1.3;
    }
    else if (age < 65) {
        lower *= 1;
        upper *= 1;
    }
    else {
        lower *= 0.75;
        upper *= 0.75;
    }

    speed = height / 200;
    bugChance = 0.4;

    frameRate(30);
    textSize(30);
}

function draw() {

    background('white');


    if (start) {
        handleBugs();
        attemptNewBug(frameCount);

        handleDifficulty(frameCount, score);
    } else {
        fill(0);
        noStroke();
        textSize(24);
        textAlign(CENTER);
        text("Naciśnij, aby rozpocząć", width / 2, height / 2);
    }

    //end lines:
    stroke(0);
    strokeWeight(10);
    line(1, 1, width, 1);
    line(1, height - 1, width, height - 1);

    drawScore();

    if (score === 20 || score > 20)
        endGame();

    gameOver(playing);
}

/**
 * handles user input
 * squashes bugs
 */
function mousePressed() {
    if (!start)
        start = true;
    var goodSquash = false;
    var badSquash = false;
    for (var i = 0; i < bugs.length; i++) {

        // update bug's state
        bugs[i].squashed = bugs[i].squashedBy(mouseX, mouseY);

        // if the bug is good, end the game
        if (bugs[i].squashed && bugs[i].type) {
            badSquash = true;
        }
        if (bugs[i].squashed && (!bugs[i].type))
            goodSquash = true;
    }

    if (badSquash && (!goodSquash))
        endGame();

    totalClicks++;
}

/**
 * updates and draws bugs
 * handles off-screen bugs
 * handles bugs array
 */
function handleBugs() {

    for (var i = bugs.length - 1; i >= 0; i--) {

        /* update & draw */
        bugs[i].update();
        bugs[i].draw();

        if (bugs[i].position.y > height && !bugs[i].type) {
            // if the bug is off the screen and it's a bad bug
            endGame();
        }

        if (bugs[i].squashed && (!bugs[i].type)) {
            // remove from bugs array

            bugs.splice(i, 1);
            score++;
        }
    }
}

/**
 * attempts to push a new bug
 */
function attemptNewBug(frame) {

    if (frame % 15 === 0) { // every half a second

        if (random() < bugChance) { // probability of a new bug

            var x = random(width / 2) + width / 4; // only in the middle
            var type = (random() > 0.8); // good or bad bug
            bugs.push(new Insect(x, type));
        }
    }
}

/**
 * variables pertaining to difficulty
 * is set based upon frame and score
 */
function handleDifficulty(frame, score) {

    if (frame % 30 === 0) {
        // update once every second

        bugChance = map(score, 0, 10, 0.4, 0.999);
        speed = map(score, 0, 20, lower, upper);
        console.log(speed)
    }
}

/**
 * draws game over message
 */
function gameOver(playing) {

    if (!playing) {
        // only if the game has ended
        // fill(0);
        // noStroke();
        // textSize(60);
        // textAlign(CENTER);
        //
        //
        // text("Your score:", width / 2, height / 2);
        //
        //
        // textSize(60);
        // text(min(1.0, score / 20.0),
        //     width / 2, height / 2 + 70);
        // textAlign(LEFT);
        // textSize(30);
        sendScoreAndReturnControl(min(1.0, score / 20.0))
    }
}

/**
 * draws the score
 */
function drawScore() {
    textSize(30);
    /* draw score */
    fill(0, 0, 0);
    noStroke();
    text(score, 15, 40);
}

/**
 * stops the loop, triggers game over
 */
function endGame() {

    playing = false;
    noLoop();
}
