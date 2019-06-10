import levels from './levels';
import store from './store';
import {
  canMoveTo,
  distanceFromPlayer,
  maxMovesMet,
  winConditionsMet,
} from './helpers';
import { EASY, MEDIUM, HARD } from './difficulty-levels'
import { log } from './util';
import { START_GAME, LOAD_LEVEL, LOSE, MOVE, WIN } from './actions';
import { LOSE_AUDIO, MOVE_AUDIO, WIN_AUDIO } from './audio';
import { NEXT_LEVEL_DELAY } from './misc';


export function startGame (levelNumber) {
    var counter = 60;
    const timer = function() {
        var timer = document.querySelector('#time');
        setInterval(function(){
            if(counter === 0){
                postScoreJson("/hexahedral/end", 0);
            }
            timer.innerHTML = counter >0 ? String(counter) : 0;
            counter -= 1;
        },1000);
    };
    timer();
  store.dispatch({ type: START_GAME });
console.log("udalo sie ruszyc z miejscaasdasdasd");
  loadLevel(levelNumber);
}


export function afterConfigFetched(configJSON){
    console.log("w trakcie response");
  console.log("Got response: " + configJSON);
  console.log("w trakcie response");
  window.name = configJSON
}


export function getJSON(link, callback) {
   var xobj = new XMLHttpRequest();
   xobj.overrideMimeType("application/json");
   xobj.open('GET', link, false);
   xobj.send(null);
   console.log("przed callbaku");
   callback(xobj.responseText);
console.log("Po callbaku");
}

export function getDifficultyByAge() {
    var age = JSON.parse(window.name)["age"];
    //var age = 7;
    if(age < 10) {
        return EASY;
    } else if (age < 15){
        return MEDIUM;
    } else
      return HARD;
}

function postScoreJson(link, score) {
    var data = JSON.parse(window.name);

    var xobj = new XMLHttpRequest();
    xobj.open('POST', link, true);
    xobj.overrideMimeType("application/json");
    xobj.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xobj.withCredentials = true;

    xobj.onreadystatechange = function() {
        if (xobj.readyState === 4 && xobj.status === 200) {
            console.log(xobj.responseText);
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
    console.log("Sending: " + sentPayload)
    xobj.send(sentPayload);
}

// Loads the given level.
export function loadLevel (levelNumber) {
  const levelExists = levelNumber in levels;

  if (!levelExists) {
    log('warn', `There is no level ${levelNumber}.`);
    levelNumber = 0;
  }

  store.dispatch({ type: LOAD_LEVEL, levelNumber });
}


// Moves the player to a specific location.
export function moveTo (row, column) {
  const state = store.getState();

  if (!canMoveTo(state, row, column)) {
    return;
  }

  const invalidMoveDistance = distanceFromPlayer(state, row, column) !== 1;

  // Ensure player only move one spot at a time.
  if (invalidMoveDistance) {
    return;
  }

  store.dispatch({ type: MOVE, row, column });
  checkForWinOrLoss();
}

// Moves the player up, down, left, or right.
export function move (rowDelta, columnDelta) {
    console.log("udalo sie ruszyc z miejsca");
  const { playerPosition } = store.getState();
  const row = playerPosition.row + rowDelta;
  const column = playerPosition.column + columnDelta;
  moveTo(row, column);
}


// Resets the current level.
export function reset () {
  const { currentLevelNumber } = store.getState();
  loadLevel(currentLevelNumber);
}

// Checks whether the level has been won or lost.
function checkForWinOrLoss () {
  const state = store.getState();
    const { startingTime } = store.getState();
    const { endTime } = store.getState();

    const deltaTime = endTime - startingTime;
  if (winConditionsMet(state)) {
    win();
  } else if (maxMovesMet(state)) {
      lose();
  }
}

// Loads the next level after a pause.
function loadNextLevelAfterDelay () {
  const { currentLevelNumber } = store.getState();
  const nextLevelNumber = currentLevelNumber + 1;
  setTimeout(() => loadLevel(nextLevelNumber), NEXT_LEVEL_DELAY);
}

// Reloads the current level after a pause.
function resetAfterDelay () {
  setTimeout(reset, NEXT_LEVEL_DELAY);
}

// Admonishes the player then restarts the current level.
function lose () {
  store.dispatch({ type: LOSE });
  resetAfterDelay();
}






// Congratulates the player then move onto the next level.
function win () {
  const { moveCount } = store.getState();
  log('info', `Completed in ${moveCount} moves.`);
  store.dispatch({ type: WIN });
  const { startingTime } = store.getState();
  const { endTime } = store.getState();

  console.log('info', `Completed in ${endTime - startingTime} time.`);
  const deltaTime = endTime - startingTime;
  var score = 0.0;
  if(deltaTime < 15000)
  {
  console.log("1 pkt");
  score = 1;
  }

  else if (deltaTime < 60000)
  {
  score = (45000 - deltaTime)/45000;
  console.log(`${(45000 - deltaTime)/45000} pkt`);
  }

  else console.log("0 pkt");
  const {numberOfTries} = store.getState();

  console.log('info', `Completed in ${numberOfTries} tries.`);
  postScoreJson("/hexahedral/end", score);

  // loadNextLevelAfterDelay();
}
