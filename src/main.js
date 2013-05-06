// Import the cocos2d module
var cocos = require('cocos2d'),
// Import the geometry module
    geo = require('geometry'),
// Import the Bat module
    Bat = require('Bat').Bat,
// Import the Ball module
    Ball = require('Ball').Ball,
// Import the Heart module
    Heart = require('Heart').Heart,
// Import the Clock module
    Clock = require('Clock').Clock,
// Import the Clock module
    GameOver = require('Tips').GameOver,
// Import the Clock module
    NewRecord = require('Tips').NewRecord;      
     

// Record list
var recordList = window.localStorage;

// Create a new layer
var Pinball = cocos.nodes.Layer.extend({
    userBat: null,

    clock: null,

    heart: new Array(),

    ball: new Array(),

    currentBallCount: null,

    ballCount: null,

    pause: false,

    init: function(ballCount) {
        // You must always call the super class version of init
        Pinball.superclass.init.call(this);

        // Enable mouse events
        this.set('isMouseEnabled', true);

        // Add three hearts to layer Pinball
        var heartList = new Array();
        var xHeart = 10,
            yHeart = 10;
        for(var i = 0 ; i < 3 ; i++) {
            var heart = Heart.create();
            heart.set('position', new geo.Point(xHeart, yHeart));
            this.addChild({child: heart});
            heartList.push(heart);
            xHeart += 30;
        }
        this.set('heart', heartList);
        
        // Add clock to layer Pinball
        var clock = Clock.create();
        clock.set('position', new geo.Point(400, 10));
        this.addChild({child: clock});
        this.set('clock', clock);

        // Add userBat to layer Pinball
        var userBat = Bat.create();
        userBat.set('position', new geo.Point(160, 450));
        this.addChild({child: userBat});
        this.set('userBat', userBat);
        this.set('ballCount', ballCount);
        this.set('currentBallCount', ballCount);

        var ballList = new Array();
        for (var i = 0 ; i < ballCount ; i += 1 ){
            // Add Ball to layer Pinball
            var xVel = Math.random() * 200 - 100,
                yVel = Math.random() * 100 + 100,
                xPos = Math.random() * 480,
                yPos = Math.random() * 200;

            var ball = Ball.create(xVel, yVel);
            ball.set('position', new geo.Point(xPos, yPos));
            this.addChild({child: ball});
            ballList.push(ball);
        };   
        this.set('ball', ballList);   



        this.scheduleUpdate();
    },

    mouseMoved: function(evt) {
        var userBat = this.get('userBat');

        var batPos = userBat.get('position');
        batPos.x = evt.locationInCanvas.x;
        userBat.set('position', batPos);
    },

    update: function (dt) {
        this.testGameOver();
        this.get('clock').countTime(dt);

        // pause / continue the game
        var pause = document.getElementById('pause');
        var obj = this;
        pause.onclick = function () {
            // stop the game
            if(!obj.get('pause')){
                obj.pauseSchedulerAndActions();
                for (var i = 0; i < obj.get('ball').length; i++) {
                    obj.get('ball')[i].pauseSchedulerAndActions();
                };
                obj.set('pause', true);
            } else {
                obj.resumeSchedulerAndActions();
                for (var i = 0; i < obj.get('ball').length; i++) {
                    obj.get('ball')[i].resumeSchedulerAndActions();
                };
                obj.set('pause', false);
            }
        }
    },

    testGameOver: function () {
        if(this.get('heart').length === 0) {   
            var endTime = this.get('clock').get('time').get('string');
            var record = recordList.getItem(this.get('ballCount'));
            var newRecord = parseFloat(endTime);

            // If new record, save new record
            if(newRecord > record) {                
                recordList.setItem(this.get('ballCount'), newRecord);                
                var node = document.getElementById("record-content"+this.get("ballCount"));
                node.innerText = newRecord + "s";

                // Show Tips
                var NewRecordText = NewRecord.create();
                NewRecordText.set('position', new geo.Point(240,200));
                this.addChild({child: NewRecordText});  

                // stop the game
                this.pauseSchedulerAndActions();
                for (var i = 0; i < this.get('ball').length; i++) {
                    this.get('ball')[i].pauseSchedulerAndActions();
                }; 
            }
            else { 
                // Show Tips
                var GameOverText = GameOver.create();
                GameOverText.set('position', new geo.Point(240,200));
                this.addChild({child: GameOverText});  

                // stop the game
                this.pauseSchedulerAndActions();
                for (var i = 0; i < this.get('ball').length; i++) {
                    this.get('ball')[i].pauseSchedulerAndActions();
                };       
            }           
        }
    },

    restart: function (ballCount) {
        var director = cocos.Director.get('sharedDirector');

        director.attachInView(document.getElementById('pinball_app'));

        // Create a scene
        var scene = cocos.nodes.Scene.create();

        // Add our layer to the scene
        scene.addChild({child: Pinball.create(ballCount)});

        // Replace current scene
        director.replaceScene(scene);
    }
});

exports.main = function() {
    // Initialise application

    // Initialise the record list
    if(recordList.length === 0) {
        for(var i = 0 ; i < 6 ; i++){
            recordList.setItem(i+5, 0);
            var recordDiv = document.getElementById("record"+(i+5));
            var element = document.createElement("p");
            element.id = "record-content"+(i+5);
            var textNode = document.createTextNode("0s");
            element.appendChild(textNode);
            recordDiv.appendChild(element);
        }
    } else {        
        for(var i = 0 ; i < 6 ; i++) {
            var recordDiv = document.getElementById("record"+(i+5));
            var element = document.createElement("p");
            element.id = "record-content"+(i+5);
            var textNode = document.createTextNode(recordList.getItem(i+5) + "s");
            element.appendChild(textNode);
            recordDiv.appendChild(element);
        }        
    }

    var start = document.getElementById('start');

    start.onclick = function() {
        // Get ball count
        var ballCount = parseInt(prompt("How many balls can you handle? (5 ~ 10)                 Default number is 5"));

        // Default number
        if(isNaN(ballCount) || ballCount < 5) {
            ballCount = 5;
        } else if(ballCount > 10) {
            ballCount = 10;
        }

        // Get director
        var director = cocos.Director.get('sharedDirector');

        // Attach director to our <div> element
        director.attachInView(document.getElementById('pinball_app'));
        
        if(director.get('_runningScene') === undefined){
            // Create a scene
            var scene = cocos.nodes.Scene.create();

            // Add our layer to the scene
            scene.addChild({child: Pinball.create(ballCount)});

            // run the scene
            director.runWithScene(scene);
        }
        // Run the scene
        if(director.get('_runningScene') !== null){
            // Create a scene
            var scene = cocos.nodes.Scene.create();
            
            // Add our layer to the scene
            scene.addChild({child: Pinball.create(ballCount)});

            // run the scene
            director.replaceScene(scene);
        }        
    }

    var clear = document.getElementById('clear-record');
    clear.onclick = function () {
        if(confirm("Are you sure to clear the records?")) {
            for(var i = 0 ; i < 6 ; i++){
                recordList.setItem(i+5, 0);
                document.getElementById("record-content"+(i+5)).innerText = "0s";
            }
        }        
    }
};
