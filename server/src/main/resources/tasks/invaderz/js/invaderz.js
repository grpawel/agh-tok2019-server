const config_endpoint = "/invaderz/config"
const postScore_endpoint = "/invaderz/end"
const INITIAL_LIVES_COUNT = 5;

let canvas,
		c,
		invaders,
		w,
		h,
		dt,
		player,
		lives,
		isEndGame = true,
		lastUpdate,
		config,
		generation,
		gameOverTxt = { 'en-US': 'Game Over!', 'pl-PL': 'Koniec Gry!' },
		generationTxt = { 'en-US': 'Generation', 'pl-PL': 'Generacja' },
		victoryTxt = { 'en-US': 'You Won!', 'pl-PL': 'Wygrałeś!' },
		livesTxt = { 'en-US': 'Lives', 'pl-PL': 'Punkty Życia' },
		scoreTxt = { 'en-US': 'Score', 'pl-PL': 'Wynik' },
		titleTxt = { 'en-US': "Shoot all the invaderz", 'pl-PL': 'Zastrzel najeźdźców' },
		subtitleTxt = { 'en-US': "before they get you!", 'pl-PL': 'zanim do ciebie dotrą!' },
		moveLeftTxt = { 'en-US': "to move left", 'pl-PL': '- ruch w lewo' },
		moveRigthTxt = { 'en-US': "to move right", 'pl-PL': '- ruch w prawo' },
		shootTxt = { 'en-US': "to shoot", 'pl-PL': '- strzał' },
		supportedLanguages = ['en-US', 'pl-PL'];

let globalSpeed = 2;
let max_generations = 3;

Array.prototype.contains = function(obj) {
  let i = this.length;
  while (i--) {
      if (this[i] == obj) {
          return true;
      }
  }
  return false;
}

let defaultLanguage = supportedLanguages[0];
let lang = navigator.language || navigator.userLanguage;
if(!supportedLanguages.contains(lang))
{
	lang = defaultLanguage;
}

canvas = document.createElement('canvas');
canvas.width = w = 480;
canvas.height = h = 960;
c = canvas.getContext('2d', {alpha : false});
if (window.devicePixelRatio > 1) {
	c.canvas.width = c.canvas.width * window.devicePixelRatio;
	c.canvas.height = c.canvas.height * window.devicePixelRatio;
  c.canvas.style.width = w / 2 + 'px';
  c.canvas.style.height = h / 2 + 'px';
	c.scale(window.devicePixelRatio, window.devicePixelRatio);
}

function getJSON(link, callback) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
		xobj.callback = callback
    xobj.open('GET', link);
    xobj.send(null);
    xobj.onload = function() {
			xobj.callback(JSON.parse(xobj.responseText));
		}
}

function maxGenerationsFromAge(age) {
	return Math.floor(age / 8);
}

function afterConfigFetched(_config){
    console.log("Got response: " + JSON.stringify(_config));
		config = _config;
		max_generations += maxGenerationsFromAge(config["age"]);
}

function init(){
	  getJSON(config_endpoint, afterConfigFetched);
		let manualImage = new Image();
		manualImage.onload = function () {
			//console.log(this.width + "x" + this.height)
			c.drawImage(this, (w - this.width) / 2, (h - this.height) / 2, this.width, this.height);
			c.textAlign = "center";
			c.fillStyle = "navy";
			c.font = "bold 25px Helvetica";
			c.fillText(titleTxt[lang], w / 2, (h - manualImage.height) / 2 + 30	);
			c.fillText(subtitleTxt[lang], w / 2, (h - manualImage.height) / 2 + 60	);
			c.textAlign = "left"
			c.font = "20px Helvetica";
			c.fillText(moveLeftTxt[lang], w / 2 - 40, (h - manualImage.height) / 2 + 130	);
			c.fillText(moveRigthTxt[lang], w / 2 - 40, (h - manualImage.height) / 2 + 245 );
			c.fillText(shootTxt[lang], w / 2 - 40, (h - manualImage.height) / 2 + 360	);
		};
		canvas.style.border = "hidden";
		document.body.appendChild( canvas );
		if( /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
			manualImage.src = "img/manual_template_mobile.png";
		}
		else {
			manualImage.src = "img/manual_template_pc.png";
		}
	}

function startGame(){
	lives = INITIAL_LIVES_COUNT;
	generation = 1;
	dt = 0;
	lastUpdate = Date.now();
	invaders = new Genetics();
	invaders.createPopulation();
	player = new Player( w/2, h );
	isEndGame = false;
	update();
}

function deltaTime(){
	let now = Date.now();
	dt = now - lastUpdate;
	lastUpdate = now;
}

function getBestOfGeneration(){
	let index = 0, best = 0;
	for(let i = 0; i < invaders.population.length; i++){
		if( invaders.population[i].fit > best ){
			best = invaders.population[i].fit;
			index = i;
		}
	}
	if( !invaders.bestOfGeneration || invaders.population[index].fit > invaders.bestOfGeneration.fit ){
		invaders.bestOfGeneration = invaders.population[index];
	}
}

function calculateScore() {
	score = (generation + lives * 2) / (max_generations + INITIAL_LIVES_COUNT * 2);
	return score;
}

function printStats() {
	c.fillStyle = "yellow";
	c.font = "20px Arial";
	c.fillText(generationTxt[lang] + ": " + generation + " / " + max_generations, 5, 20);
	c.fillText(livesTxt[lang] + ": " + lives, 5, 45);
}

function printBasicScene() {
	c.clearRect(0,0,w,h);
	printStats();
}

function postScoreJson(link, score) {
    let xobj = new XMLHttpRequest();
    xobj.open('POST', link);
    xobj.overrideMimeType("application/json");
    xobj.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xobj.withCredentials = true

    xobj.onreadystatechange = function() {
        if (xobj.readyState === 4 && xobj.status === 200) {
			window.location.replace(xobj.responseText);
		}
    };

    var sentPayload =
        JSON.stringify(
            {
                group : config["group"],
                nick : config["nick"],
                age : config["age"],
                result: score
            }
        );
    console.log("Sending: " + sentPayload);
    xobj.send(sentPayload);
}

function gameOver() {
	printBasicScene()
	let score = calculateScore();
	let scoreText = scoreTxt[lang] + ": " + score.toFixed(2);
	c.font = "40px Arial";
	c.fillText(gameOverTxt[lang], (w-c.measureText(gameOverTxt).width) / 2, h / 2);
	c.font = "30px Arial";
	c.fillText(scoreText, (w-c.measureText(scoreTxt).width) / 2, h / 2 + 40);
	isEndGame = true;
	postScoreJson(postScore_endpoint, score);
}

function endGame() {
	printBasicScene()
	c.fillStyle = "yellow";
	let score = calculateScore();
	let scoreText = scoreTxt[lang] + ": " + score.toFixed(2);
	c.font = "40px Arial";
	c.fillText(victoryTxt[lang], (w-c.measureText(victoryTxt).width) / 2, h / 2);
	c.font = "30px Arial";
	c.fillText(scoreText, (w-c.measureText(scoreTxt).width) / 2, h / 2 + 40);
	isEndGame = true;
	postScoreJson(postScoreJson, score);
}

function update(){
	printBasicScene()
	for(let i = 0; i < invaders.population.length; i++){
		invaders.population[i].show();
	}
	player.show();
	let allDead = true;
	for(let i = 0; i < invaders.population.length; i++){
		if( invaders.population[i].isAlive ){
			allDead = false;
			break;
		}
	}

	if(lives <= 0) {
		gameOver();
		return;
	}

	if(allDead) {
		if(generation < max_generations) {
			getBestOfGeneration();
			if(generation % 3) {
				invaders.evolve();
			} else {
				invaders.elitism();
			}
			generation++;
		} else {
			endGame();
			return;
		}
	}
	deltaTime();
	requestAnimationFrame(update);
}

function addEvents(){
	document.addEventListener("keydown",function(e){
		switch(e.keyCode){
			case 13 :
					startGame();
				break;
			case 32 :
				if(!isEndGame)
					player.shoot();
				else
					startGame();
				break;
			case 37 :
			case 65 :
					player.isMovingLeft = true;
				break;
			case 39 :
			case 68 :
					player.isMovingRight = true;
				break;
		}
	});

	document.addEventListener("keyup",function(e){
		switch(e.keyCode){
			case 37 :
			case 65 :
					player.isMovingLeft = false;
				break;
			case 39 :
			case 68 :
					player.isMovingRight = false;
				break;
		}
	});

	window.addEventListener("focus",function(){
		lastUpdate = Date.now();
	});

	window.addEventListener('load', function(e) {

		window.applicationCache.addEventListener('updateready', function(e) {
		  if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
				window.applicationCache.swapCache();
				window.location.reload();
		  }
		}, false);

	}, false);


	let deferredPrompt;
	const addBtn = document.createElement('button');

	window.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
		deferredPrompt = e;
		addBtn.addEventListener('click', (e) => {
		  addBtn.style.display = 'none';
		  deferredPrompt.prompt();
		  deferredPrompt.userChoice.then((choiceResult) => {
		      deferredPrompt = null;
		    });
		});
	});

// credit: http://www.javascriptkit.com/javatutors/touchevents2.shtml
	function swipeDetect(el, callback){

	    var touchsurface = el,
	    swipedir,
	    startX,
	    startY,
	    distX,
	    distY,
	    threshold = 50, //required min distance traveled to be considered swipe
	    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
	    allowedTime = 300, // maximum time allowed to travel that distance
	    elapsedTime,
	    startTime,
	    handleswipe = callback || function(swipedir){}

	    touchsurface.addEventListener('touchstart', function(e){
	        var touchobj = e.changedTouches[0]
	        swipedir = 'none'
	        dist = 0
	        startX = touchobj.pageX
	        startY = touchobj.pageY
	        startTime = new Date().getTime() // record time when finger first makes contact with surface
	        e.preventDefault()
	    }, false)

	    touchsurface.addEventListener('touchmove', function(e){
	        e.preventDefault() // prevent scrolling when inside DIV
	    }, false)

	    touchsurface.addEventListener('touchend', function(e){
	        var touchobj = e.changedTouches[0]
	        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
	        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
	        elapsedTime = new Date().getTime() - startTime // get time elapsed
	        if (elapsedTime <= allowedTime){ // first condition for awipe met
	            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
	                swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
	            }
	            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
	                swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
	            }
	        }
	        handleswipe(swipedir)
	        e.preventDefault()
	    }, false)
	}

	swipeDetect(window, function(direction){
		switch(direction){
			case "left":
				player.isMovingRight = false
				player.isMovingLeft = true
				break;
			case "right":
				player.isMovingRight = true
				player.isMovingLeft = false
				break;
			case "down":
				player.isMovingRight = false
				player.isMovingLeft = false
				break;
			case "none":
				if( isEndGame ){
					startGame();
				}else{
					player.shoot();
				}
				break;
		}
	})
}

addEvents();
init();
