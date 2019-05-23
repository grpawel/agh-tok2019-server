const dict = {
	time: "Czas: ",
	level: "Poziom ",
	totalTime: "Pozostały czas: ",
	finish: "Gratulacje! Całkowity czas: ",
	loose: "Przegrałeś :( całkowity czas: ",
	seconds: " sekund",
	points: "Zdobyte punkty: "
};

Ball.Game = function(game) {};
Ball.Game.prototype = {
	create: function() {
		this.add.sprite(0, 0, 'screen-bg');
		this.add.sprite(0, 0, 'panel');
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.fontSmall = { font: "16px Arial", fill: "#e4beef" };
		this.fontBig = { font: "24px Arial", fill: "#e4beef" };
		this.fontMessage = { font: "24px Arial", fill: "#e4beef",  align: "center", stroke: "#320C3E", strokeThickness: 4 };
		this.timer = 0;
		this.totalTimer = 0;
		this.level = 1;
		this.maxLevels = 5;
		this.movementForce = 50;
		this.ballStartPos = { x: Ball._WIDTH*0.5, y: 450 };

		this.timerText = this.game.add.text(15, 15, dict.time + this.timer, this.fontBig);
		this.levelText = this.game.add.text(120, 10, dict.level + this.level+" / "+this.maxLevels, this.fontSmall);
		this.totalTimeText = this.game.add.text(120, 30, dict.totalTime + (60 - this.totalTimer), this.fontSmall);

		this.hole = this.add.sprite(Ball._WIDTH*0.5, 90, 'hole');
		this.physics.enable(this.hole, Phaser.Physics.ARCADE);
		this.hole.anchor.set(0.5);
		this.hole.body.setSize(2, 2);

		this.ball = this.add.sprite(this.ballStartPos.x, this.ballStartPos.y, 'ball');
		this.ball.anchor.set(0.5);
		this.physics.enable(this.ball, Phaser.Physics.ARCADE);
		this.ball.body.setSize(18, 18);
		var getBounce = function() {
			var age = window.config.age;
			if (age < 10) {
				return 0.2
			} else if (age < 30){
				return 0.5
			} else {
				return 0.35
			}
		};
		var bounce = getBounce();
		this.ball.body.bounce.set(bounce, bounce);

		this.initLevels();
		this.showLevel(1);
		this.keys = this.game.input.keyboard.createCursorKeys();

		Ball._player = this.ball;
		window.addEventListener("deviceorientation", this.handleOrientation, true);
		console.log(window.DeviceOrientationEvent)

		this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);

		this.borderGroup = this.add.group();
		this.borderGroup.enableBody = true;
		this.borderGroup.physicsBodyType = Phaser.Physics.ARCADE;
		this.borderGroup.create(0, 50, 'border-horizontal');
		this.borderGroup.create(0, Ball._HEIGHT-2, 'border-horizontal');
		this.borderGroup.create(0, 0, 'border-vertical');
		this.borderGroup.create(Ball._WIDTH-2, 0, 'border-vertical');
		this.borderGroup.setAll('body.immovable', true);
	},
	initLevels: function() {
		this.levels = [];
		const l1 = [
			[
				{ x: 96, y: 240, t: 'w' },
			],
			[
				{ x: 96, y: 140, t: 'w' },
			],
			[
				{ x: 96, y: 320, t: 'w' },
			]
		];
		const l2 = [
			[
				{ x: 72, y: 320, t: 'w' },
				{ x: 200, y: 320, t: 'h' },
				{ x: 72, y: 150, t: 'w' }
			],
			[
				{ x: 72, y: 320, t: 'w' },
				{ x: 72, y: 320, t: 'h' },
				{ x: 160, y: 220, t: 'w' }
			],
			[
				{ x: 76, y: 320, t: 'w' },
				{ x: 204, y: 320, t: 'h' },
				{ x: 0, y: 200, t: 'w' }
			],
		];
		const l3 = [
			[
				{ x: 64, y: 300, t: 'h' },
				{ x: 224, y: 352, t: 'h' },
				{ x: 30, y: 240, t: 'w' },
				{ x: 138, y: 240, t: 'w' },
				{ x: 200, y: 80, t: 'h' }
			],
			[
				{ x: 64, y: 352, t: 'h' },
				{ x: 224, y: 352, t: 'h' },
				{ x: 0, y: 240, t: 'w' },
				{ x: 128, y: 240, t: 'w' },
				{ x: 200, y: 52, t: 'h' }
			],
			[
				{ x: 64, y: 332, t: 'h' },
				{ x: 224, y: 332, t: 'h' },
				{ x: 20, y: 240, t: 'w' },
				{ x: 95, y: 180, t: 'w' },
				{ x: 170, y: 240, t: 'w' },
			],
		];
		const l4 = [
			[
				{ x: 174, y: 352, t: 'h' },
				{ x: 78, y: 320, t: 'w' },
				{ x: 0, y: 240, t: 'w' },
				{ x: 125, y: 240, t: 'w' },
				{ x: 65, y: 150, t: 'w' },
				{ x: 193, y: 150, t: 'w' }
			],
			[
				{ x: 78, y: 352, t: 'h' },
				{ x: 78, y: 320, t: 'w' },
				{ x: 70, y: 240, t: 'w' },
				{ x: 192, y: 240, t: 'w' },
				{ x: 0, y: 150, t: 'w' },
				{ x: 128, y: 150, t: 'w' }
			],
			[
				{ x: 78, y: 352, t: 'h' },
				{ x: 78, y: 320, t: 'w' },
				{ x: 0, y: 240, t: 'w' },
				{ x: 192, y: 240, t: 'w' },
				{ x: 30, y: 150, t: 'w' },
				{ x: 158, y: 150, t: 'w' }
			],
		];
		const l5 = [
			[
				{ x: 92, y: 352, t: 'h' },
				{ x: 92, y: 320, t: 'w' },
				{ x: 65, y: 240, t: 'w' },
				{ x: 193, y: 240, t: 'w' },
				{ x: 256, y: 240, t: 'h' },
				{ x: 52, y: 52, t: 'h' },
				{ x: 52, y: 148, t: 'w' }
			],
			[
				{ x: 188, y: 352, t: 'h' },
				{ x: 92, y: 390, t: 'w' },
				{ x: 0, y: 240, t: 'w' },
				{ x: 128, y: 240, t: 'w' },
				{ x: 256, y: 180, t: 'h' },
				{ x: 180, y: 52, t: 'h' },
				{ x: 52, y: 148, t: 'w' }
			],
			[
				{ x: 188, y: 352, t: 'h' },
				{ x: 92, y: 320, t: 'w' },
				{ x: 0, y: 240, t: 'w' },
				{ x: 128, y: 240, t: 'w' },
				{ x: 256, y: 240, t: 'h' },
				{ x: 180, y: 52, t: 'h' },
				{ x: 52, y: 148, t: 'w' }
			],
		];
		this.levelData = [
			l1[Math.floor(Math.random()*l1.length)],
			l2[Math.floor(Math.random()*l2.length)],
			l3[Math.floor(Math.random()*l3.length)],
			l4[Math.floor(Math.random()*l4.length)],
			l5[Math.floor(Math.random()*l5.length)],
		];
		for(var i=0; i<this.maxLevels; i++) {
			var newLevel = this.add.group();
			newLevel.enableBody = true;
			newLevel.physicsBodyType = Phaser.Physics.ARCADE;
			for(var e=0; e<this.levelData[i].length; e++) {
				var item = this.levelData[i][e];
				newLevel.create(item.x, item.y, 'element-'+item.t);
			}
			newLevel.setAll('body.immovable', true);
			newLevel.visible = false;
			this.levels.push(newLevel);
		}
	},
	showLevel: function(level) {
		var lvl = level | this.level;
		if(this.levels[lvl-2]) {
			this.levels[lvl-2].visible = false;
		}
		this.levels[lvl-1].visible = true;
	},
	updateCounter: function() {
		this.timer++;
		this.timerText.setText(dict.time + this.timer);
		this.totalTimeText.setText(dict.totalTime + (60 - this.totalTimer  - this.timer));
		if((this.totalTimer + this.timer) === 60){
			this.totalTimer += this.timer;
			const points = this.calculatePoints();
			this.sendResult(points);
			this.game.state.start('Howto');
		}
	},
	update: function() {
		if(this.keys.left.isDown) {
			this.ball.body.velocity.x -= this.movementForce;
		}
		else if(this.keys.right.isDown) {
			this.ball.body.velocity.x += this.movementForce;
		}
		if(this.keys.up.isDown) {
			this.ball.body.velocity.y -= this.movementForce;
		}
		else if(this.keys.down.isDown) {
			this.ball.body.velocity.y += this.movementForce;
		}
		this.physics.arcade.collide(this.ball, this.borderGroup, this.wallCollision, null, this);
		this.physics.arcade.collide(this.ball, this.levels[this.level-1], this.wallCollision, null, this);
		this.physics.arcade.overlap(this.ball, this.hole, this.finishLevel, null, this);
	},
	wallCollision: function() {
		if("vibrate" in window.navigator) {
			window.navigator.vibrate(100);
		}
	},
	handleOrientation: function(e) {
		var x = e.gamma; // range [-90,90], left-right
		var y = e.beta;  // range [-180,180], top-bottom
		var z = e.alpha; // range [0,360], up-down
		Ball._player.body.velocity.x += x;
		Ball._player.body.velocity.y += y*0.5;
	},
	finishLevel: function() {
		if(this.level >= this.maxLevels) {
			this.level++;
			this.totalTimer += this.timer;
			const points = this.calculatePoints();
			this.sendResult(points);
			this.game.state.start('Howto');
		}
		else {
			this.totalTimer += this.timer;
			this.timer = 0;
			this.level++;
			this.timerText.setText(dict.time + this.timer);
			this.totalTimeText.setText(dict.totalTime + (60 - this.totalTimer));
			this.levelText.setText(dict.level + this.level+" / "+this.maxLevels);
			this.ball.body.x = this.ballStartPos.x;
			this.ball.body.y = this.ballStartPos.y;
			this.ball.body.velocity.x = 0;
			this.ball.body.velocity.y = 0;
			this.showLevel();
		}
	},
	sendResult: function(result) {
		var data = {
			group: window.config.group,
			nick: window.config.nick,
			age: window.config.age,
			result: result
		};
		fetch('/cyber-orb/end', {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			credentials: 'same-origin', // include, *same-origin, omit
			headers: {
				'Content-Type': 'application/json',
			},
			redirect: 'follow', // manual, *follow, error
			referrer: 'no-referrer', // no-referrer, *client
			body: JSON.stringify(data), // body data type must match "Content-Type" header
		}).then(function(response) {
			return response.text();
		}).then(function(path){
			window.location.href = path
		});
	},
	calculatePoints: function(){
		const levelPoints = (this.level - 1) * 0.15;
		const timePoints = Math.max(Math.min((60 - this.totalTimer) * 0.01, 0.25), 0);
		return levelPoints + timePoints;
	},
	render: function() {
		// this.game.debug.body(this.ball);
		// this.game.debug.body(this.hole);
	}
};