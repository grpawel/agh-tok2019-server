
var config_endpoint = "/angry-birds/config";
var postScore_endpoint = "/angry-birds/end";
var scoreSent = false;

var instructionText;
getJSON(config_endpoint, afterConfigFetched);

function getJSON(link, callback) {
    window.name = JSON.stringify({age: 20})
    console.log("Sending request for config: " + link);
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', link, false);
    xobj.send(null);
    callback(xobj.responseText);
}

function afterConfigFetched(configJSON){
    console.log("Got response: " + configJSON);
    window.name = configJSON
}

function sendScoreAndReturnControl(score){
    var adapterData = JSON.parse(window.name);
    postScoreJson(postScore_endpoint, score);
}

function getTowerCnt() {
    var age = JSON.parse(window.name)["age"];
    //var age = 7;
    if(age < 8) {
        return 2;
    } else if (age < 15) {
        return 3;
    } else {
        return 4;
    }
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
            result : score
        }
      );
    console.log("Sending: " + sentPayload)
    xobj.send(sentPayload);
}


const buildingBase =
  []
const screen = window.screen;
const {height, width} = screen;
// const scale = height > 500? 1:0.5;
var scale = 1;
let W_max, W_min;


var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (isMobile) {
    scale =0.45;
    W_max= 0.8*height;
    W_min= 0.3*height;
}else{
    W_max= 0.9*width;
    W_min= 0.3*width;
}

const enemiesNames = ['enemy', 'enemy1', 'enemy2']
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
var CMenu = cc.Sprite.extend({
    defaultScale: 0.8*scale,
    hovered: false,
    boundingBox: null,
    onClickCallback: null,
    ctor: function (tex) {
        this._super();
        this.initWithTexture(tex);
        this.setScale(this.defaultScale);
    },
    onClick: function (callback) {
        this.onClickCallback = callback;
    },
    handleTouches: function (touch, evt) {
        (this.hovered && this.onClickCallback) && this.onClickCallback();
    },
    handleTouchesMoved: function (touch, evt) {
        var point = touch[0].getLocation();
        
        this.boundingBox || (this.boundingBox = this.getBoundingBox());
        
        if (cc.Rect.CCRectContainsPoint(this.boundingBox, point)) {
            if (!this.hovered) {
                this.hovered = true;
                this.runAction(cc.ScaleTo.create(0.01, 1));
            }
        } else if (this.hovered) {
            this.hovered = false;
            this.runAction(cc.ScaleTo.create(0.01, this.defaultScale));
        }
    },
    handleTouchesEnded: function (touch, evt) {}
});

var GameLayer = cc.Layer.extend({
    enemies: [],
    ranges:[],
    birdsMax: 3,
    birdsUsed: 0,
    enemiesCnt: 4,
    birdSprite: null,
    isDraggingSling: false,
    birdStartPos: cc.p(260*scale, 440.5*scale),
    slingRadius: {
        min: 20,
        max: 80
    },
    slingAngle: {
        min: cc.DEGREES_TO_RADIANS(250),
        max: cc.DEGREES_TO_RADIANS(295)
    },
    smokeDistance: 16,
    menus: [],
    lastSmoke: null,
    slingRubber1: null,
    slingRubber2: null,
    slingRubber3: null,
    getTexture: function (name) {
        return cc.TextureCache.getInstance()
          .addImage('img/' + name + '.png');
    },
    addRoof: function(x, level, withEnemy){
        var cube1Sprite = this.addObject({
            name: "wood1",
            x: x,
            y: 71 + 100*level,
            type: "dynamic",
            shape: "box",
            userData: new BodyUserData(GameObjectRoll.Wood, 2000),
            scale,
        });
        var hWood3Sprite = this.addObject({
            name: "wood2",
            x: x - 50*scale,
            y: 71 + 100*level,
            rotation: -40,
            scaleX: 0.8*scale,
            type: "dynamic",
            shape: "box",
            userData: new BodyUserData(GameObjectRoll.Wood, 2000),
            scale,
        });
        var hWood4Sprite = this.addObject({
            name: "wood2",
            x: x + 50*scale,
            y: 71 + 100*level,
            rotation: 40,
            scaleX: 0.8*scale,
            type: "dynamic",
            shape: "box",
            userData: new BodyUserData(GameObjectRoll.Wood, 2000),
            scale,
        });
    },
    addDeckTower: function(x,level) {
        var cube1Sprite = this.addObject({
            name: "wood1",
            x: x,
            y: 71 + 100*level,
            type: "dynamic",
            shape: "box",
            userData: new BodyUserData(GameObjectRoll.Wood, 2000),
            scale,
        });
    },
    addEnemyTower: function(x,level) {
        this.addEnemy({
            name: enemiesNames[Math.floor(Math.random() * enemiesNames.length)],
            x,
            y: 71 +  100*level,
            type: "dynamic",
            shape: "circle",
            density: 2,
            userData: new BodyUserData(GameObjectRoll.Enemy, 200),
            scale,
        });
    },
    
    addDeck: function(x, level, withEnemy){
        var cube1Sprite = this.addObject({
            name: "wood1",
            x: x - 90*scale,
            y: 71 + 100*level,
            type: "dynamic",
            shape: "box",
            userData: new BodyUserData(GameObjectRoll.Wood, 4000),
            scale,
        });
        var cube2Sprite = this.addObject({
            name: "wood1",
            x: x + 90*scale,
            y: 71 + 100*level ,
            type: "dynamic",
            shape: "box",
            userData: new BodyUserData(GameObjectRoll.Wood, 4000),
            scale,
        });
        var hWood1Sprite = this.addObject({
            name: "wood2",
            x,
            y: 71 +  100*level +45,
            scaleX: 1.3*scale,
            type: "dynamic",
            shape: "box",
            userData: new BodyUserData(GameObjectRoll.Wood, 4000),
            scale,
        });
        if(withEnemy){
            this.addEnemy({
                name: enemiesNames[Math.floor(Math.random() * enemiesNames.length)],
                x,
                y: 71 +  100*level +1,
                type: "dynamic",
                shape: "circle",
                density: 2,
                userData: new BodyUserData(GameObjectRoll.Enemy, 200),
                scale,
            });
            
            
        }
    },
    addObject: function (desc) {
        
        var sprite = cc.Sprite.createWithTexture(this.getTexture(desc.name));
        
        sprite.setAnchorPoint(desc.anchor || cc.p(0.5, 0.5));
        sprite.setScaleX(desc.scaleX || desc.scale || 1);
        sprite.setScaleY(desc.scaleY || desc.scale || 1);
        sprite.setRotation(desc.rotation || 0);
        sprite.setPosition(cc.p(desc.x || 0, desc.y || 0));
        
        desc.shape && b2.enablePhysicsFor({
            type: desc.type,
            shape: desc.shape,
            sprite: sprite,
            radius: desc.radius,
            density: desc.density,
            userData: desc.userData
        });
        
        this.addChild(sprite, desc.z || 0);
        return sprite;
    },
    addEnemy: function(enemy){
        this.addObject(enemy);
        
        this.enemies.push(enemy.userData)
    },
    buildRandomDecked: function(){
        W = 150*scale;
        
        let x = getRandomArbitrary(W_min, W_max);
        let a_x = x - W;
        let b_x = x + W;
        let it = 0;
        while(this.ranges.some(r => {
            a =r[0];
        b =r[1];
        return (a_x >= a &&  b_x <= b) || (a_x <= a &&  b_x >=a ) || (a_x <= b &&  b_x >=b )
    }) && it < 100){
            x = getRandomArbitrary(W_min, W_max);
            a_x = x - W;
            b_x = x + W;
            it += 1;
        }

        if(it < 100){
            this.ranges.push([x-W,x+W]);
            ranges = this.ranges;

            let lmax = getRandomArbitrary(1,5);
            for (let level = 0; level< lmax ; level++){
                this.addDeck(x, level, getRandomArbitrary(0,100) < 75);
            }
            if(getRandomArbitrary(0,100) < 80){
                this.addRoof(x, lmax);
            }
        }




    },buildRandomTower: function(){
        w = 80*scale;
        
        let x = getRandomArbitrary(W_min, W_max);
        let a_x = x - w;
        let b_x = x + w;
        let it = 0;
        while(this.ranges.some(r => {
            a =r[0];
        b =r[1];
        return (a_x > a &&  b_x < b) || (a_x < a &&  b_x >a ) || (a_x < b &&  b_x >b )
    }) && it < 100){
            x = getRandomArbitrary(W_min, W_max);
            a_x = x - w;
            b_x = x + w;
        }
        if(it<100){
            this.ranges.push([x-w,x+w]);
            ranges = this.ranges;


            let lmax = getRandomArbitrary(1,5);
            for (let level = 0; level< lmax ; level++){
                this.addDeckTower(x, level);
            }
            if(getRandomArbitrary(0,100) < 80){
                this.addEnemyTower(x, lmax);
            }
        }





    },
    init: function () {
        this._super();
        this.removeAllChildrenWithCleanup(true);
        this.setTouchEnabled(true);
        this.birdsUsed = 0;
        this.ranges =[];
        this.sent = false;
        birds = 1;
        
        var director = cc.Director.getInstance(),
          self = this,
          winSize = director.getWinSize();
        
        b2.initWorld();
        
        var bgSprite = this.addObject({
            name: "bg",
            scale: 1.2*scale,
            
            anchor: cc.p(0, 0),
            z: -1
        });
        
        var groundSprite = this.addObject({
            name: "ground",
            scaleX: 2.5*scale,
            anchor: cc.p(0, 0),
            type: "static",
            shape: "box",
            density: 0
        });
        var platformSprite = this.addObject({
            name: "platform",
            y: 30,
            scale: 1.5*scale,
            anchor: cc.p(0, 0),
            type: "static",
            shape: "box",
            density: 0
        });
        
        var sling1Sprite = this.addObject({
            name: "sling1",
            x: 284.5*scale,
            y: 319.5*scale,
            scale: 0.7*scale,
            anchor: cc.p(1, 0)
        });
        var sling2Sprite = this.addObject({
            name: "sling2",
            x: 268.5*scale,
            y: 376.5*scale,
            scale: 0.7*scale,
            anchor: cc.p(1, 0),
            z: 3
        });
        for(let building = 0; building < getTowerCnt(); building++){
            if(getRandomArbitrary(1,100) % 2 === 0){
                this.buildRandomDecked()
            }else{
                this.buildRandomTower();
            }
            
            
        }
        
        this.birdSprite = this.addObject({
            name: "bird1",
            x: 200*scale,
            y: 300*scale,
            z: 1,
            scale,
        });
        
        this.slingRubber1 = this.addObject({
            name: "sling3",
            x: 278*scale,
            y: 436*scale,
            scaleY: 0.7*scale,
            scaleX: 0*scale,
            anchor: cc.p(1, 0.5),
            z: 0
        });
        this.slingRubber2 = this.addObject({
            name: "sling3",
            x: 250*scale,
            y: 440*scale,
            scaleY: 0.7*scale,
            scaleX: 0*scale,
            anchor: cc.p(1, 0.5),
            z: 2
        });
        this.slingRubber3 = null;
        
        // --------- Top Menu ! ---------
        
        
        // var refreshMenu = new CMenu(this.getTexture("menu_refresh"));
        // refreshMenu.setPosition(cc.p(70, winSize.height - margin));
        // refreshMenu.onClick(function () {
        //
        //     self.init();
        // });
        // this.addChild(refreshMenu);
        // this.menus.push(refreshMenu);
        
        // --------- My Score ! ---------
        
        var scoreLabel = cc.LabelTTF.create("0", "fantasy", 20, cc.size(0, 0), cc.TEXT_ALIGNMENT_LEFT);
        scoreLabel.setPosition(cc.p(60, 180));


        scoreLabel.schedule(function () {

            const score = self.getScore();



            scoreLabel.setString("score: "+(score)
                .toString());

        });
        var birdLabel = cc.LabelTTF.create("0", "fantasy", 20, cc.size(0, 0), cc.TEXT_ALIGNMENT_LEFT);
        birdLabel.setPosition(cc.p(60, 150));
        birdLabel.schedule(function () {

            const used = self.birdsUsed + 1;
            const left = self.birdsMax;


            birdLabel.setString("birds: "+Math.min(used,3).toString()+"/"+left.toString());

        });
        this.addChild(scoreLabel, 5);
        this.addChild(birdLabel, 6);

        // --------- Setup Sling's Bomb ! ---------
        
        var action = cc.Spawn.create(cc.RotateBy.create(1.5, 360), cc.JumpTo.create(1.5, this.birdStartPos, 100, 1));
        this.birdSprite.runAction(action);
        
        this.scheduleUpdate();
    },
    getScore: function(){
        const enemies = this.enemies.length;
        const enemyDead = this.enemies.filter(e => e.isDead).length;
        const birdUsed = this.birdsUsed;
        const score = (enemyDead/(enemies*birdUsed))
        return enemyDead === 0? 0: score;
    },

    checkIfEnd: function(){
        return this.enemies.every(e => e.isDead) || this.birdsUsed +1 >= this.birdsMax;
    },
    update: function (dt) {
        b2.simulate();

        if(this.checkIfEnd() && !this.sent){
            this.sent = true;
            const score = this.getScore();

            setTimeout(function(s){postScoreJson(postScore_endpoint, s);
            }, 5000, score);

            return;
        }
        
        if (this.birdSprite.body) {
            var bData = this.birdSprite.body.GetUserData();
            if (!bData || bData.isContacted) {
                if(!this.sent)
                    this.birdsUsed = this.birdsUsed +1;
                if(this.birdsUsed < this.birdsMax){


                    this.birdSprite = this.addObject({
                        name: "bird"+(this.birdsUsed +1),
                        x: 200,
                        y: 300,
                        z: 1
                    });
                    birds = birds + 1;
                    var action = cc.Spawn.create(cc.RotateBy.create(1.5, 360), cc.JumpTo.create(1.5, this.birdStartPos, 100, 1));
                    this.birdSprite.runAction(action);
                    return;


                }


            }
            
            
            var birdPos = this.birdSprite.getPosition(),
              vector = cc.pSub(birdPos, (this.lastSmoke && this.lastSmoke.getPosition()) || cc.p(0, 0)),
              length = cc.pLength(vector);
            
            
            if (length >= this.smokeDistance) {
                this.lastSmoke = this.addObject({
                    name: "smoke",
                    x: birdPos.x,
                    y: birdPos.y,
                    scale: Math.random() >= 0.5 ? 0.8 : 0.6
                });
            }
        }
    },
    onTouchesBegan: function (touch, evt) {
        this.menus.forEach(function (menu) {
            menu.handleTouches(touch, evt);
        });
        
        var currPoint = touch[0].getLocation(),
          vector = cc.pSub(this.birdStartPos, currPoint);
        
        if ((this.isDraggingSling = (cc.pLength(vector) < this.slingRadius.max)) && !this.birdSprite.body && !this.slingRubber3) {
            this.slingRubber3 = this.addObject({
                name: "sling3",
                x: currPoint.x,
                y: currPoint.y,
                scaleY: 1.5,
                scaleX: 2,
                anchor: cc.p(0, 0.5),
                z: 1
            });
        }
    },
    onTouchesMoved: function (touch, evt) {
        this.menus.forEach(function (menu) {
            menu.handleTouchesMoved(touch, evt);
        });
        
        if (!this.isDraggingSling || this.birdSprite.body) return;
        
        var currPoint = touch[0].getLocation(),
          vector = cc.pSub(currPoint, this.birdStartPos),
          radius = cc.pLength(vector),
          angle = cc.pToAngle(vector);
        
        angle = angle < 0 ? (Math.PI * 2) + angle : angle;
        radius = MathH.clamp(radius, this.slingRadius.min, this.slingRadius.max);
        if (angle <= this.slingAngle.max && angle >= this.slingAngle.min) {
            radius = this.slingRadius.min;
        }
        
        this.birdSprite.setPosition(cc.pAdd(this.birdStartPos, cc.p(radius * Math.cos(angle), radius * Math.sin(angle))));
        
        var updateRubber = function (rubber, to, lengthAddon, topRubber) {
            var from = rubber.getPosition(),
              rubberVec = cc.pSub(to, from),
              rubberAng = cc.pToAngle(rubberVec),
              rubberDeg = cc.RADIANS_TO_DEGREES(rubberAng),
              length = cc.pLength(rubberVec) + (lengthAddon || 8);
            
            rubber.setRotation(-rubberDeg);
            rubber.setScaleX(-(length / rubber.getContentSize()
              .width));
            
            if (topRubber) {
                rubber.setScaleY(1.1 - ((0.7 / this.slingRadius.max) * length));
                this.slingRubber3.setRotation(-rubberDeg);
                this.slingRubber3.setPosition(cc.pAdd(from, cc.p((length) * Math.cos(rubberAng), (length) * Math.sin(rubberAng))));
            }
        }.bind(this);
        
        var rubberToPos = this.birdSprite.getPosition();
        updateRubber(this.slingRubber2, rubberToPos, 13, true);
        updateRubber(this.slingRubber1, rubberToPos, 0);
        this.slingRubber1.setScaleY(this.slingRubber2.getScaleY());
    },
    onTouchesEnded: function (touch, evt) {
        this.menus.forEach(function (menu) {
            menu.handleTouchesEnded(touch, evt);
        });
        
        if (!this.birdSprite.body && this.isDraggingSling) {
            this.slingRubber1.setVisible(false);
            this.slingRubber2.setVisible(false);
            this.slingRubber3.setVisible(false);
            
            b2.enablePhysicsFor({
                type: "dynamic",
                shape: "circle",
                sprite: this.birdSprite,
                density: 15,
                restitution: 0.4,
                userData: new BodyUserData(GameObjectRoll.Bird, 250)
            });
            
            var vector = cc.pSub(this.birdStartPos, this.birdSprite.getPosition()),
              impulse = cc.pMult(vector, 12),
              bPos = this.birdSprite.body.GetWorldCenter();
            
            this.birdSprite.body.ApplyImpulse(impulse, bPos);
            
            this.isDraggingSling = false;
        }
    },
    onKeyUp: function (e) {},
    onKeyDown: function (e) {}
});


//--------------------- Scene ---------------------

var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        
        var layer = new GameLayer();
        layer.init();
        
        this.addChild(layer);
    }
});


var cocos2dApp = cc.Application.extend({
    config: document.querySelector('#cocos2d-html5')['c'],
    ctor: function (scene) {
        this._super();
        this.startScene = scene;
        cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
        cc.setup(this.config['tag']);
        cc.Loader.getInstance()
          .onloading = function () {
            cc.LoaderScene.getInstance()
              .draw();
        };
        cc.Loader.getInstance()
          .onload = function () {
            cc.AppController.shareAppController()
              .didFinishLaunchingWithOptions();
        };
        
        cc.Loader.getInstance()
          .preload(g_ressources);
    },
    applicationDidFinishLaunching: function () {
        var director = cc.Director.getInstance();
        director.setDisplayStats(this.config['showFPS']);
        director.setAnimationInterval(1.0 / this.config['frameRate']);
        director.runWithScene(new this.startScene());
        
        return true;
    }
});


(function() {
    var canvas = document.getElementById('viewport'),
        context = canvas.getContext('2d');

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        /**
         * Your drawings need to be inside this function otherwise they will be reset when
         * you resize the browser window and the canvas goes will be cleared.
         */
        drawStuff();
    }
    resizeCanvas();

    function drawStuff() {
        var myApp = new cocos2dApp(GameScene);
    }
})();